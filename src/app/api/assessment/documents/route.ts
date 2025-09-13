/**
 * Assessment Document Management API - ComplianceIQ
 * Handles document upload, storage, and version control for assessments
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

// Upload document for assessment
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assessmentId = formData.get('assessmentId') as string;
    const documentType = formData.get('documentType') as string;
    const description = formData.get('description') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const version = formData.get('version') as string || '1.0';

    if (!file || !assessmentId || !uploadedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), 'uploads', 'assessments', assessmentId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${documentType}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save document record to database
    const document = await prisma.assessmentDocument.create({
      data: {
        assessmentId,
        documentType: documentType || 'evidence',
        fileName: file.name,
        filePath: filePath.replace(process.cwd(), ''),
        fileSize: file.size,
        mimeType: file.type,
        version,
        description,
        uploadedBy
      }
    });

    // Create audit log entry
    await prisma.assessmentAuditLog.create({
      data: {
        assessmentId,
        action: 'document_uploaded',
        description: `Document uploaded: ${file.name} (${documentType})`,
        performedBy: uploadedBy,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          documentType
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// Get documents for assessment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    const documentType = searchParams.get('documentType');
    const isActive = searchParams.get('isActive');

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const where: any = { assessmentId };
    
    if (documentType) {
      where.documentType = documentType;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const documents = await prisma.assessmentDocument.findMany({
      where,
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industryType" TEXT,
    "description" TEXT,
    "website" TEXT,
    "subscriptionTier" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "therapeuticFocus" TEXT[],
    "aiInitiatives" TEXT[],
    "deploymentScenarios" TEXT[],

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapeutic_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "complexityPoints" INTEGER NOT NULL DEFAULT 10,
    "regulatoryRequirements" JSONB,
    "specificOverlays" JSONB,

    CONSTRAINT "therapeutic_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "complexityPoints" INTEGER NOT NULL,
    "specificRequirements" JSONB,
    "securityConsiderations" JSONB,

    CONSTRAINT "ai_model_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_scenarios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "complexityPoints" INTEGER NOT NULL,
    "regulatoryPathway" TEXT,
    "validationRequirements" JSONB,

    CONSTRAINT "deployment_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assessmentName" TEXT NOT NULL,
    "geographicScope" TEXT NOT NULL,
    "ipStrategy" TEXT NOT NULL,
    "currentScore" INTEGER NOT NULL DEFAULT 0,
    "maxPossibleScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_sections" (
    "id" TEXT NOT NULL,
    "sectionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "basePoints" INTEGER NOT NULL,
    "isCriticalBlocker" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "assessment_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dynamic_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "validationCriteria" JSONB,
    "evidenceRequired" TEXT[],
    "responsibleRoles" TEXT[],
    "therapySpecificConditions" JSONB,
    "aiModelConditions" JSONB,
    "geographicConditions" JSONB,
    "ipConditions" JSONB,

    CONSTRAINT "dynamic_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_responses" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "responseValue" JSONB,
    "evidenceDocuments" TEXT[],
    "completionStatus" TEXT,
    "validatedBy" TEXT,
    "validationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_intelligence" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "regulationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "therapeuticAreas" TEXT[],
    "aiModelRelevance" TEXT[],
    "impactLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulatory_intelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guidance_content" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionSteps" TEXT[],
    "resources" JSONB,
    "examples" TEXT[],
    "regulatoryCitations" TEXT[],

    CONSTRAINT "guidance_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bottleneck_patterns" (
    "id" TEXT NOT NULL,
    "therapeuticArea" TEXT NOT NULL,
    "aiModelType" TEXT NOT NULL,
    "bottleneckDescription" TEXT NOT NULL,
    "resolutionStrategy" TEXT NOT NULL,
    "successRate" DECIMAL(65,30) NOT NULL,
    "implementationTimeDays" INTEGER NOT NULL,
    "resourceRequirements" JSONB,

    CONSTRAINT "bottleneck_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_insights" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "insightData" JSONB,
    "confidenceScore" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_versions" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionName" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "completionRate" DECIMAL(65,30) NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "maxPossibleScore" INTEGER NOT NULL,
    "criticalBlockers" INTEGER NOT NULL,
    "completedSections" INTEGER NOT NULL,
    "totalSections" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "assessment_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_responses" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "responseValue" JSONB NOT NULL,
    "points" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_documents" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "assessment_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_audit_logs" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "versionId" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "assessment_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_personas" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "expertiseLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sub_personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_section_mappings" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "subPersonaId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "responsibilityType" TEXT NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "canReview" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "priorityScore" INTEGER NOT NULL DEFAULT 1,
    "collaborationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_section_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_question_mappings" (
    "id" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "subPersonaId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "expertiseRequired" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_question_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapy_question_conditions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "therapeuticAreaId" TEXT NOT NULL,
    "conditionLogic" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "therapy_question_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_collaboration_states" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "assignedTo" TEXT,
    "reviewedBy" TEXT,
    "approvedBy" TEXT,
    "comments" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "section_collaboration_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaboration_sessions" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collaboration_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_participants" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_threads" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "threadName" TEXT NOT NULL,
    "sectionId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "threadId" TEXT,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "parentMessageId" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reactions" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_invitations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "invitedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_features" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "role_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AIModelTypeToAssessment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AssessmentToTherapeuticArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AssessmentToDeploymentScenario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_versions_assessmentId_version_key" ON "assessment_versions"("assessmentId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_responses_versionId_questionId_key" ON "assessment_responses"("versionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "persona_section_mappings_personaId_subPersonaId_sectionId_key" ON "persona_section_mappings"("personaId", "subPersonaId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "persona_question_mappings_personaId_subPersonaId_questionId_key" ON "persona_question_mappings"("personaId", "subPersonaId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "therapy_question_conditions_questionId_therapeuticAreaId_key" ON "therapy_question_conditions"("questionId", "therapeuticAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "session_participants_sessionId_userId_key" ON "session_participants"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_reactions_messageId_userId_emoji_key" ON "message_reactions"("messageId", "userId", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "session_invitations_sessionId_email_key" ON "session_invitations"("sessionId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "features_name_key" ON "features"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_features_roleId_featureId_key" ON "role_features"("roleId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_AIModelTypeToAssessment_AB_unique" ON "_AIModelTypeToAssessment"("A", "B");

-- CreateIndex
CREATE INDEX "_AIModelTypeToAssessment_B_index" ON "_AIModelTypeToAssessment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssessmentToTherapeuticArea_AB_unique" ON "_AssessmentToTherapeuticArea"("A", "B");

-- CreateIndex
CREATE INDEX "_AssessmentToTherapeuticArea_B_index" ON "_AssessmentToTherapeuticArea"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssessmentToDeploymentScenario_AB_unique" ON "_AssessmentToDeploymentScenario"("A", "B");

-- CreateIndex
CREATE INDEX "_AssessmentToDeploymentScenario_B_index" ON "_AssessmentToDeploymentScenario"("B");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dynamic_questions" ADD CONSTRAINT "dynamic_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_responses" ADD CONSTRAINT "user_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance_content" ADD CONSTRAINT "guidance_content_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_insights" ADD CONSTRAINT "learning_insights_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_versions" ADD CONSTRAINT "assessment_versions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "assessment_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_documents" ADD CONSTRAINT "assessment_documents_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_personas" ADD CONSTRAINT "sub_personas_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_section_mappings" ADD CONSTRAINT "persona_section_mappings_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_section_mappings" ADD CONSTRAINT "persona_section_mappings_subPersonaId_fkey" FOREIGN KEY ("subPersonaId") REFERENCES "sub_personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_section_mappings" ADD CONSTRAINT "persona_section_mappings_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_question_mappings" ADD CONSTRAINT "persona_question_mappings_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_question_mappings" ADD CONSTRAINT "persona_question_mappings_subPersonaId_fkey" FOREIGN KEY ("subPersonaId") REFERENCES "sub_personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_question_mappings" ADD CONSTRAINT "persona_question_mappings_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_question_conditions" ADD CONSTRAINT "therapy_question_conditions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_question_conditions" ADD CONSTRAINT "therapy_question_conditions_therapeuticAreaId_fkey" FOREIGN KEY ("therapeuticAreaId") REFERENCES "therapeutic_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_collaboration_states" ADD CONSTRAINT "section_collaboration_states_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_sessions" ADD CONSTRAINT "collaboration_sessions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "chat_threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_invitations" ADD CONSTRAINT "session_invitations_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_invitations" ADD CONSTRAINT "session_invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_features" ADD CONSTRAINT "role_features_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_features" ADD CONSTRAINT "role_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AIModelTypeToAssessment" ADD CONSTRAINT "_AIModelTypeToAssessment_A_fkey" FOREIGN KEY ("A") REFERENCES "ai_model_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AIModelTypeToAssessment" ADD CONSTRAINT "_AIModelTypeToAssessment_B_fkey" FOREIGN KEY ("B") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToTherapeuticArea" ADD CONSTRAINT "_AssessmentToTherapeuticArea_A_fkey" FOREIGN KEY ("A") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToTherapeuticArea" ADD CONSTRAINT "_AssessmentToTherapeuticArea_B_fkey" FOREIGN KEY ("B") REFERENCES "therapeutic_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToDeploymentScenario" ADD CONSTRAINT "_AssessmentToDeploymentScenario_A_fkey" FOREIGN KEY ("A") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssessmentToDeploymentScenario" ADD CONSTRAINT "_AssessmentToDeploymentScenario_B_fkey" FOREIGN KEY ("B") REFERENCES "deployment_scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

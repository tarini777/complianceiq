/**
 * WebSocket API Route for ComplianceIQ
 * Handles Socket.io server initialization and connection management
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import SocketManager from '@/lib/socket';

let socketManager: SocketManager | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!socketManager) {
    // Initialize Socket.io server
    const httpServer = (res as any).socket?.server as HTTPServer;
    
    if (!httpServer) {
      return res.status(500).json({ message: 'HTTP server not available' });
    }

    socketManager = new SocketManager(httpServer);
    console.log('Socket.io server initialized');
  }

  res.status(200).json({ 
    message: 'Socket.io server is running',
    onlineUsers: socketManager ? 'Connected' : 'Not connected'
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

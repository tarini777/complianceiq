-- CreateTable
CREATE TABLE "collaboration_analytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "messagesSent" INTEGER NOT NULL DEFAULT 0,
    "messagesReceived" INTEGER NOT NULL DEFAULT 0,
    "responseTime" INTEGER,
    "activeMinutes" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadsCreated" INTEGER NOT NULL DEFAULT 0,
    "reactionsGiven" INTEGER NOT NULL DEFAULT 0,
    "reactionsReceived" INTEGER NOT NULL DEFAULT 0,
    "mentionsSent" INTEGER NOT NULL DEFAULT 0,
    "mentionsReceived" INTEGER NOT NULL DEFAULT 0,
    "sessionJoinTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionLeaveTime" TIMESTAMP(3),
    "totalSessionTime" INTEGER,
    "assessmentSectionsViewed" INTEGER NOT NULL DEFAULT 0,
    "assessmentSectionsCompleted" INTEGER NOT NULL DEFAULT 0,
    "assessmentProgress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collaboration_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_analytics" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageLength" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "sentimentScore" DOUBLE PRECISION,
    "sentimentLabel" TEXT,
    "complexityScore" DOUBLE PRECISION,
    "urgencyScore" DOUBLE PRECISION,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "reactionsCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "responseTime" INTEGER,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_performance_metrics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "totalParticipants" INTEGER NOT NULL,
    "activeParticipants" INTEGER NOT NULL,
    "averageResponseTime" DOUBLE PRECISION,
    "messageVolume" INTEGER NOT NULL DEFAULT 0,
    "collaborationScore" DOUBLE PRECISION,
    "engagementScore" DOUBLE PRECISION,
    "productivityScore" DOUBLE PRECISION,
    "communicationClarity" DOUBLE PRECISION,
    "assessmentCompletionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "averageAssessmentScore" DOUBLE PRECISION,
    "timeToCompletion" INTEGER,
    "bottleneckSeverity" DOUBLE PRECISION,
    "bottleneckType" TEXT,
    "bottleneckDescription" TEXT,
    "riskScore" DOUBLE PRECISION,
    "successProbability" DOUBLE PRECISION,
    "recommendedActions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_patterns" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "peakActivityHour" INTEGER,
    "averageMessageLength" DOUBLE PRECISION,
    "messagesPerHour" DOUBLE PRECISION,
    "responseRate" DOUBLE PRECISION,
    "mostActiveWith" TEXT,
    "threadParticipation" DOUBLE PRECISION,
    "mentionFrequency" DOUBLE PRECISION,
    "activeDays" TEXT[],
    "sessionDuration" INTEGER,
    "breakFrequency" INTEGER,
    "questionRatio" DOUBLE PRECISION,
    "directiveRatio" DOUBLE PRECISION,
    "supportiveRatio" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentiment_analysis" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallSentiment" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "positiveScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "negativeScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "neutralScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "joyScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "angerScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fearScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "sadnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "surpriseScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "urgencyLevel" DOUBLE PRECISION,
    "formalityLevel" DOUBLE PRECISION,
    "collaborativeTone" DOUBLE PRECISION,
    "aiModel" TEXT NOT NULL DEFAULT 'complianceiq-sentiment-v1',
    "analysisVersion" TEXT NOT NULL DEFAULT '1.0',
    "rawAnalysis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sentiment_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictive_insights" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "insightCategory" TEXT NOT NULL,
    "severity" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendation" TEXT,
    "expectedImpact" TEXT,
    "timeframe" TEXT,
    "triggerMetrics" TEXT,
    "supportingEvidence" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictive_insights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaboration_analytics_sessionId_userId_key" ON "collaboration_analytics"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_analytics_messageId_key" ON "message_analytics"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "team_performance_metrics_sessionId_key" ON "team_performance_metrics"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "communication_patterns_sessionId_userId_key" ON "communication_patterns"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "sentiment_analysis_messageId_key" ON "sentiment_analysis"("messageId");

-- AddForeignKey
ALTER TABLE "collaboration_analytics" ADD CONSTRAINT "collaboration_analytics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_analytics" ADD CONSTRAINT "collaboration_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaboration_analytics" ADD CONSTRAINT "collaboration_analytics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_analytics" ADD CONSTRAINT "message_analytics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_analytics" ADD CONSTRAINT "message_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_analytics" ADD CONSTRAINT "message_analytics_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_performance_metrics" ADD CONSTRAINT "team_performance_metrics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_performance_metrics" ADD CONSTRAINT "team_performance_metrics_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_patterns" ADD CONSTRAINT "communication_patterns_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_patterns" ADD CONSTRAINT "communication_patterns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_patterns" ADD CONSTRAINT "communication_patterns_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_analysis" ADD CONSTRAINT "sentiment_analysis_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_analysis" ADD CONSTRAINT "sentiment_analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_analysis" ADD CONSTRAINT "sentiment_analysis_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictive_insights" ADD CONSTRAINT "predictive_insights_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "collaboration_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictive_insights" ADD CONSTRAINT "predictive_insights_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictive_insights" ADD CONSTRAINT "predictive_insights_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

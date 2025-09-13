-- CreateTable
CREATE TABLE "ask_rexi_training_data" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "variations" TEXT[],
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "actionItems" TEXT[],
    "impactLevel" TEXT NOT NULL,
    "sources" TEXT[],
    "keywords" TEXT[],
    "therapeuticAreas" TEXT[],
    "aiModelTypes" TEXT[],
    "deploymentScenarios" TEXT[],
    "personas" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ask_rexi_training_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ask_rexi_response_cache" (
    "id" TEXT NOT NULL,
    "questionHash" TEXT NOT NULL,
    "originalQuestion" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "hitCount" INTEGER NOT NULL DEFAULT 1,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ask_rexi_response_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ask_rexi_non_contextual_patterns" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ask_rexi_non_contextual_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ask_rexi_contextual_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ask_rexi_contextual_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ask_rexi_question_similarity" (
    "id" TEXT NOT NULL,
    "question1Id" TEXT NOT NULL,
    "question2Id" TEXT NOT NULL,
    "similarityScore" DECIMAL(3,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ask_rexi_question_similarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ask_rexi_usage_analytics" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "userSatisfaction" INTEGER,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ask_rexi_usage_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ask_rexi_training_data_category_idx" ON "ask_rexi_training_data"("category");

-- CreateIndex
CREATE INDEX "ask_rexi_training_data_subcategory_idx" ON "ask_rexi_training_data"("subcategory");

-- CreateIndex
CREATE INDEX "ask_rexi_training_data_keywords_idx" ON "ask_rexi_training_data" USING GIN("keywords");

-- CreateIndex
CREATE INDEX "ask_rexi_training_data_tags_idx" ON "ask_rexi_training_data" USING GIN("tags");

-- CreateIndex
CREATE INDEX "ask_rexi_response_cache_question_hash_idx" ON "ask_rexi_response_cache"("questionHash");

-- CreateIndex
CREATE INDEX "ask_rexi_response_cache_category_idx" ON "ask_rexi_response_cache"("category");

-- CreateIndex
CREATE INDEX "ask_rexi_response_cache_hit_count_idx" ON "ask_rexi_response_cache"("hitCount");

-- CreateIndex
CREATE INDEX "ask_rexi_response_cache_last_accessed_idx" ON "ask_rexi_response_cache"("lastAccessed");

-- CreateIndex
CREATE INDEX "ask_rexi_non_contextual_patterns_pattern_idx" ON "ask_rexi_non_contextual_patterns"("pattern");

-- CreateIndex
CREATE INDEX "ask_rexi_contextual_keywords_keyword_idx" ON "ask_rexi_contextual_keywords"("keyword");

-- CreateIndex
CREATE INDEX "ask_rexi_contextual_keywords_category_idx" ON "ask_rexi_contextual_keywords"("category");

-- CreateIndex
CREATE INDEX "ask_rexi_question_similarity_question1_idx" ON "ask_rexi_question_similarity"("question1Id");

-- CreateIndex
CREATE INDEX "ask_rexi_question_similarity_question2_idx" ON "ask_rexi_question_similarity"("question2Id");

-- CreateIndex
CREATE INDEX "ask_rexi_question_similarity_similarity_score_idx" ON "ask_rexi_question_similarity"("similarityScore");

-- CreateIndex
CREATE INDEX "ask_rexi_usage_analytics_category_idx" ON "ask_rexi_usage_analytics"("category");

-- CreateIndex
CREATE INDEX "ask_rexi_usage_analytics_created_at_idx" ON "ask_rexi_usage_analytics"("createdAt");

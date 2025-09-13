-- AlterTable
ALTER TABLE "assessment_sections" ADD COLUMN     "aiModelOverlaysJson" JSONB,
ADD COLUMN     "learningComponentsJson" JSONB,
ADD COLUMN     "productionValidator" TEXT,
ADD COLUMN     "sectionType" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "therapyOverlaysJson" JSONB;

-- AlterTable
ALTER TABLE "dynamic_questions" ADD COLUMN     "aiModelOverlaysJson" JSONB,
ADD COLUMN     "complexityPoints" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "deploymentOverlaysJson" JSONB,
ADD COLUMN     "isProductionBlocker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productionValidator" TEXT,
ADD COLUMN     "therapyOverlaysJson" JSONB;

-- CreateTable
CREATE TABLE "section_filtering_rules" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "conditionLogic" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_filtering_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_filtering_rules" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "conditionLogic" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_filtering_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapy_specific_overlays" (
    "id" TEXT NOT NULL,
    "therapeuticAreaId" TEXT NOT NULL,
    "sectionId" TEXT,
    "questionId" TEXT,
    "overlayType" TEXT NOT NULL,
    "overlayContent" JSONB NOT NULL,
    "complexityPoints" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapy_specific_overlays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_model_specific_overlays" (
    "id" TEXT NOT NULL,
    "aiModelTypeId" TEXT NOT NULL,
    "sectionId" TEXT,
    "questionId" TEXT,
    "overlayType" TEXT NOT NULL,
    "overlayContent" JSONB NOT NULL,
    "complexityPoints" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_model_specific_overlays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deployment_specific_overlays" (
    "id" TEXT NOT NULL,
    "deploymentScenarioId" TEXT NOT NULL,
    "sectionId" TEXT,
    "questionId" TEXT,
    "overlayType" TEXT NOT NULL,
    "overlayContent" JSONB NOT NULL,
    "complexityPoints" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deployment_specific_overlays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_system_components" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "componentContent" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_system_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_scoring_rules" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "conditionLogic" JSONB NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "maxPoints" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_scoring_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "section_filtering_rules" ADD CONSTRAINT "section_filtering_rules_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_filtering_rules" ADD CONSTRAINT "question_filtering_rules_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_specific_overlays" ADD CONSTRAINT "therapy_specific_overlays_therapeuticAreaId_fkey" FOREIGN KEY ("therapeuticAreaId") REFERENCES "therapeutic_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_specific_overlays" ADD CONSTRAINT "therapy_specific_overlays_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_specific_overlays" ADD CONSTRAINT "therapy_specific_overlays_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_specific_overlays" ADD CONSTRAINT "ai_model_specific_overlays_aiModelTypeId_fkey" FOREIGN KEY ("aiModelTypeId") REFERENCES "ai_model_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_specific_overlays" ADD CONSTRAINT "ai_model_specific_overlays_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_model_specific_overlays" ADD CONSTRAINT "ai_model_specific_overlays_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_specific_overlays" ADD CONSTRAINT "deployment_specific_overlays_deploymentScenarioId_fkey" FOREIGN KEY ("deploymentScenarioId") REFERENCES "deployment_scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_specific_overlays" ADD CONSTRAINT "deployment_specific_overlays_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deployment_specific_overlays" ADD CONSTRAINT "deployment_specific_overlays_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "dynamic_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_system_components" ADD CONSTRAINT "learning_system_components_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_scoring_rules" ADD CONSTRAINT "assessment_scoring_rules_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "assessment_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

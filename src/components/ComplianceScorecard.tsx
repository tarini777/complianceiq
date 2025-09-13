'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentScore, AssessmentResponse, Question } from '@/types';

interface ComplianceScorecardProps {
  score: AssessmentScore;
  responses: Record<string, AssessmentResponse>;
  questions: Question[];
}

export const ComplianceScorecard: React.FC<ComplianceScorecardProps> = ({
  score,
  responses,
  questions
}) => {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 border-green-200';
    if (percentage >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getCompletionStatus = () => {
    const completed = questions.filter(q => responses[q.id]?.completionStatus === 'complete').length;
    const total = questions.length;
    const percentage = Math.round((completed / total) * 100);
    
    if (percentage >= 90) return { status: 'Excellent', color: 'text-green-600' };
    if (percentage >= 70) return { status: 'Good', color: 'text-blue-600' };
    if (percentage >= 50) return { status: 'In Progress', color: 'text-yellow-600' };
    return { status: 'Needs Attention', color: 'text-red-600' };
  };

  const completionStatus = getCompletionStatus();

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className={getScoreBackground(score.completionPercentage)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Compliance Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(score.completionPercentage)}`}>
              {score.completionPercentage}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Score</p>
              <p className="text-2xl font-semibold">{score.currentScore} / {score.maxPossibleScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${completionStatus.color}`}>
                {completionStatus.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sections Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{score.sectionsCompleted}</div>
            <p className="text-xs text-gray-600">of {score.totalSections} sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Blockers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${score.criticalBlockers > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {score.criticalBlockers}
            </div>
            <p className="text-xs text-gray-600">
              {score.criticalBlockers === 0 ? 'No blockers' : 'Need immediate attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => responses[q.id]?.completionStatus === 'complete').length}
            </div>
            <p className="text-xs text-gray-600">of {questions.length} questions</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{score.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    score.completionPercentage >= 80 ? 'bg-green-600' :
                    score.completionPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score.completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Section-by-Section Progress */}
            <div className="space-y-2">
              <h4 className="font-medium">Section Progress</h4>
              {[...new Set(questions.map(q => q.sectionTitle))].map((section, idx) => {
                const sectionQuestions = questions.filter(q => q.sectionTitle === section);
                const completed = sectionQuestions.filter(q => responses[q.id]?.completionStatus === 'complete').length;
                const percentage = Math.round((completed / sectionQuestions.length) * 100);
                
                return (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-sm w-32 truncate">{section}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {score.criticalBlockers > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800">
                  🚨 Address {score.criticalBlockers} critical blocker(s) immediately
                </p>
                <p className="text-xs text-red-600 mt-1">
                  These items must be resolved before proceeding with AI deployment
                </p>
              </div>
            )}
            
            {score.completionPercentage < 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-medium text-yellow-800">
                  ⚠️ Continue working on incomplete sections
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Focus on sections with the lowest completion rates
                </p>
              </div>
            )}
            
            {score.completionPercentage >= 80 && score.criticalBlockers === 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium text-green-800">
                  ✅ Ready for regulatory review
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Your assessment shows strong compliance readiness
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

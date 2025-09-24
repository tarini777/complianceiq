import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ScaleAnalyticsData {
  scaleAnalytics: {
    averageScore: number;
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    scoreDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
    improvementAreas: number;
    completedQuestions: number;
    totalQuestions: number;
  };
  insights: {
    overallRating: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  stats: {
    totalScaleQuestions: number;
    completedScaleQuestions: number;
    averageResponseTime: number;
    mostCommonScore: number;
    scoreVariance: number;
  };
}

interface ScaleAnalyticsDashboardProps {
  assessmentId?: string;
  personaId?: string;
  sectionId?: string;
}

export const ScaleAnalyticsDashboard: React.FC<ScaleAnalyticsDashboardProps> = ({
  assessmentId,
  personaId,
  sectionId
}) => {
  const [analytics, setAnalytics] = useState<ScaleAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScaleAnalytics();
  }, [assessmentId, personaId, sectionId]);

  const fetchScaleAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (assessmentId) params.append('assessmentId', assessmentId);
      if (personaId) params.append('personaId', personaId);
      if (sectionId) params.append('sectionId', sectionId);

      const response = await fetch(`/api/analytics/scale?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching scale analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading scale analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No scale analytics data available</p>
      </div>
    );
  }

  const { scaleAnalytics, insights, stats } = analytics;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scaleAnalytics.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              out of 5.0 scale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.overallRating}</div>
            <p className="text-xs text-muted-foreground">
              {scaleAnalytics.percentage.toFixed(1)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Areas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{scaleAnalytics.improvementAreas}</div>
            <p className="text-xs text-muted-foreground">
              areas need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scaleAnalytics.completedQuestions}/{scaleAnalytics.totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              questions completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(scaleAnalytics.scoreDistribution).map(([score, count]) => (
              <div key={score} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Score {score}:</span>
                  <span className="text-sm text-gray-600">
                    {score === '1' && 'Strongly Disagree'}
                    {score === '2' && 'Disagree'}
                    {score === '3' && 'Neutral'}
                    {score === '4' && 'Agree'}
                    {score === '5' && 'Strongly Agree'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        parseInt(score) <= 2 ? 'bg-red-500' : 
                        parseInt(score) === 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(count / scaleAnalytics.completedQuestions) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.strengths.length > 0 ? (
              <ul className="space-y-2">
                {insights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No specific strengths identified</p>
            )}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {insights.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{weakness}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No specific weaknesses identified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-gray-600">
                {scaleAnalytics.completedQuestions} of {scaleAnalytics.totalQuestions} questions
              </span>
            </div>
            <Progress 
              value={(scaleAnalytics.completedQuestions / scaleAnalytics.totalQuestions) * 100} 
              className="h-2"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score Progress</span>
              <span className="text-sm text-gray-600">
                {scaleAnalytics.totalScore} of {scaleAnalytics.maxPossibleScore} points
              </span>
            </div>
            <Progress 
              value={scaleAnalytics.percentage} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScaleAnalyticsDashboard;

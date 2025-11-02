import React, { useState, useEffect } from 'react';
import { Smartphone, Tv, Gamepad2, Youtube, MessageSquare, Mail, Book, TrendingUp, AlertCircle, CheckCircle, Award, Clock, Zap, Heart } from 'lucide-react';

const ACTIVITY_TYPES = [
  { id: 'social', name: 'Social Media', icon: MessageSquare, calories: 150, color: 'bg-pink-500', recommended: 1 },
  { id: 'streaming', name: 'Streaming Videos', icon: Youtube, calories: 120, color: 'bg-red-500', recommended: 2 },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, calories: 180, color: 'bg-purple-500', recommended: 1.5 },
  { id: 'tv', name: 'TV/Movies', icon: Tv, calories: 100, color: 'bg-blue-500', recommended: 2 },
  { id: 'messaging', name: 'Messaging Apps', icon: Mail, calories: 80, color: 'bg-green-500', recommended: 1 },
  { id: 'browsing', name: 'Web Browsing', icon: Smartphone, calories: 90, color: 'bg-yellow-500', recommended: 2 },
  { id: 'reading', name: 'Digital Reading', icon: Book, calories: 60, color: 'bg-indigo-500', recommended: 2 },
];

export default function DigitalCalorieCalculator() {
  const [activities, setActivities] = useState(
    ACTIVITY_TYPES.map(type => ({ ...type, hours: 0, minutes: 0, seconds: 0 }))
  );
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showResults, setShowResults] = useState(false);
  const [moderateDiet, setModerateDiet] = useState([]);

  useEffect(() => {
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    let calories = 0;

    activities.forEach(activity => {
      const timeInHours = activity.hours + activity.minutes / 60 + activity.seconds / 3600;
      calories += timeInHours * activity.calories;
      
      totalHours += activity.hours;
      totalMinutes += activity.minutes;
      totalSeconds += activity.seconds;
    });

    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Calculate moderate diet recommendations
    const recommendations = ACTIVITY_TYPES.map(type => ({
      name: type.name,
      recommended: type.recommended,
      calories: type.recommended * type.calories,
      color: type.color
    }));

    setTotalCalories(calories);
    setTotalTime({ hours: totalHours, minutes: totalMinutes, seconds: totalSeconds });
    setModerateDiet(recommendations);
    setShowResults(calories > 0);
  }, [activities]);

  const updateTime = (id, field, value) => {
    const numValue = parseInt(value) || 0;
    let maxValue = 23;
    if (field === 'minutes' || field === 'seconds') maxValue = 59;

    setActivities(prev =>
      prev.map(activity =>
        activity.id === id 
          ? { ...activity, [field]: Math.max(0, Math.min(maxValue, numValue)) }
          : activity
      )
    );
  };

  const resetCalculator = () => {
    setActivities(ACTIVITY_TYPES.map(type => ({ ...type, hours: 0, minutes: 0, seconds: 0 })));
    setShowResults(false);
  };

  const getHealthStatus = () => {
    if (totalCalories < 600) return { 
      status: 'Excellent', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      icon: CheckCircle, 
      message: 'Outstanding! Your digital consumption is well-balanced and healthy.',
      emoji: '🎉'
    };
    if (totalCalories < 1200) return { 
      status: 'Moderate', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      icon: AlertCircle, 
      message: 'Your screen time is moderate. Consider the recommendations below for optimal wellness.',
      emoji: '⚠'
    };
    return { 
      status: 'High', 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      icon: AlertCircle, 
      message: 'Time for a digital detox! Your screen time significantly exceeds healthy limits.',
      emoji: '🚨'
    };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;
  const totalRecommendedCalories = moderateDiet.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
            <Smartphone className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Digital Calorie Calculator
          </h1>
          <p className="text-gray-600 text-lg">Monitor your screen time and achieve digital wellness</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Activity Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">Track Your Activities</h2>
              </div>
              
              <div className="space-y-3">
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  const activityCalories = (activity.hours + activity.minutes / 60 + activity.seconds / 3600) * activity.calories;
                  
                  return (
                    <div key={activity.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-lg transition-all border border-gray-200">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`${activity.color} p-3 rounded-xl shadow-md`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{activity.name}</h3>
                            <p className="text-sm text-gray-500">{activity.calories} cal/hr • Recommended: {activity.recommended}h/day</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center">
                            <input
                              type="number"
                              min="0"
                              max="23"
                              value={activity.hours || ''}
                              onChange={(e) => updateTime(activity.id, 'hours', e.target.value)}
                              className="w-16 px-2 py-2 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-center font-semibold focus:ring-2 focus:ring-indigo-200 transition-all"
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-600 mt-1 font-medium">hrs</span>
                          </div>
                          <span className="text-gray-400 text-2xl font-bold">:</span>
                          <div className="flex flex-col items-center">
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={activity.minutes || ''}
                              onChange={(e) => updateTime(activity.id, 'minutes', e.target.value)}
                              className="w-16 px-2 py-2 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-center font-semibold focus:ring-2 focus:ring-indigo-200 transition-all"
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-600 mt-1 font-medium">min</span>
                          </div>
                          <span className="text-gray-400 text-2xl font-bold">:</span>
                          <div className="flex flex-col items-center">
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={activity.seconds || ''}
                              onChange={(e) => updateTime(activity.id, 'seconds', e.target.value)}
                              className="w-16 px-2 py-2 border-2 border-indigo-200 rounded-xl focus:outline-none focus:border-indigo-500 text-center font-semibold focus:ring-2 focus:ring-indigo-200 transition-all"
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-600 mt-1 font-medium">sec</span>
                          </div>
                        </div>
                      </div>
                      {activityCalories > 0 && (
                        <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-gray-300">
                          <span className="text-gray-600 font-medium">Digital Calories Consumed</span>
                          <span className="font-bold text-purple-600 text-lg">
                            {activityCalories.toFixed(1)} cal
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Results & Recommendations */}
          <div className="space-y-4">
            {showResults && (
              <>
                {/* Total Calories Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Your Digital Intake</h3>
                  </div>
                  <div className="text-center mb-4">
                    <p className="text-indigo-100 text-sm mb-2">Total Digital Calories</p>
                    <h2 className="text-6xl font-extrabold mb-2">{totalCalories.toFixed(1)}</h2>
                    <p className="text-indigo-100 text-sm">calories/day</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-indigo-100 text-sm text-center mb-1">Total Screen Time</p>
                    <p className="text-2xl font-bold text-center">
                      {totalTime.hours}h {totalTime.minutes}m {totalTime.seconds}s
                    </p>
                  </div>
                </div>

                {/* Health Status Card */}
                <div className={`border-2 ${healthStatus.borderColor} ${healthStatus.bgColor} rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`w-8 h-8 ${healthStatus.color} flex-shrink-0 mt-1`} />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-2xl font-bold ${healthStatus.color}`}>
                          {healthStatus.status}
                        </h3>
                        <span className="text-2xl">{healthStatus.emoji}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{healthStatus.message}</p>
                    </div>
                  </div>
                </div>

                {/* Moderate Digital Diet Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800">Moderate Digital Diet</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Recommended daily screen time for balanced wellness</p>
                  
                  <div className="space-y-2 mb-4">
                    {moderateDiet.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-indigo-600">{item.recommended}h</p>
                          <p className="text-xs text-gray-500">{item.calories.toFixed(0)} cal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Daily Target:</span>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-indigo-600">{totalRecommendedCalories.toFixed(0)}</p>
                        <p className="text-xs text-gray-600">calories/day</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wellness Tips Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">Wellness Tips</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 font-bold">•</span>
                      <span className="text-sm leading-relaxed">Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 font-bold">•</span>
                      <span className="text-sm leading-relaxed">Create screen-free zones, especially in bedrooms and during meals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 font-bold">•</span>
                      <span className="text-sm leading-relaxed">Use blue light filters in the evening to protect sleep quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 font-bold">•</span>
                      <span className="text-sm leading-relaxed">Replace 30 minutes of screen time with physical activity daily</span>
                    </li>
                  </ul>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetCalculator}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Reset Calculator
                </button>
              </>
            )}

            {!showResults && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="inline-block p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                  <TrendingUp className="w-12 h-12 text-indigo-600" />
                </div>
                <p className="text-gray-600 leading-relaxed">Enter your daily screen time for each activity to calculate your digital calories and get personalized wellness recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 font-medium">
            💚 Digital Wellness Project - Balance your screen time for a healthier life
          </p>
        </div>
      </div>
    </div>
  );
}

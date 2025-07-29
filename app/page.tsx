"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Sparkles, Clock, Heart, Download, Share2, Eye, MessageCircle, Star, Crown, Award, Zap, Users, TrendingUp, Search, Filter, Grid, List } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ResultPage } from '@/components/result-page';

const featuredArtworks = [
  {
    id: 1,
    title: "龙年新春·金辉满堂",
    prompt: "1988年2月15日 14:00",
    image: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 4002,
    views: 12500,
    comments: 89,
    badge: "Daily Winner",
    badgeColor: "bg-yellow-500",
    user: "张明轩",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 2,
    title: "水墨江南·诗意人生",
    prompt: "1995年7月8日 09:30",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3866,
    views: 9800,
    comments: 156,
    badge: "Daily Winner",
    badgeColor: "bg-yellow-500",
    user: "李诗雨",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 3,
    title: "星河璀璨·命运之轮",
    prompt: "1992年11月23日 22:15",
    image: "https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 4483,
    views: 15200,
    comments: 203,
    badge: "Daily Runner-up",
    badgeColor: "bg-purple-500",
    user: "王天宇",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 4,
    title: "凤凰涅槃·重生之美",
    prompt: "1990年4月12日 06:45",
    image: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3421,
    views: 8900,
    comments: 127,
    badge: "Daily Bronze",
    badgeColor: "bg-orange-600",
    user: "陈雅琳",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 5,
    title: "山水禅意·静心悟道",
    prompt: "1987年9月3日 16:20",
    image: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3266,
    views: 7600,
    comments: 94,
    badge: "Daily Winner",
    badgeColor: "bg-yellow-500",
    user: "刘禅心",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 6,
    title: "紫气东来·贵人相助",
    prompt: "1993年12月31日 23:59",
    image: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3453,
    views: 9100,
    comments: 168,
    badge: "Daily Winner",
    badgeColor: "bg-yellow-500",
    user: "赵紫薇",
    avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 7,
    title: "金秋时节·收获满满",
    prompt: "1985年10月15日 12:00",
    image: "https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3208,
    views: 6800,
    comments: 85,
    badge: "Daily Bronze",
    badgeColor: "bg-orange-600",
    user: "孙秋实",
    avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 8,
    title: "青春年华·梦想起航",
    prompt: "1998年6月1日 08:30",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 3204,
    views: 7200,
    comments: 112,
    badge: "Daily 5%",
    badgeColor: "bg-blue-500",
    user: "周梦飞",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

export default function Home() {
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentBaziData, setCurrentBaziData] = useState<any>(null);
  const [currentImageData, setCurrentImageData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!date || !hour || !gender) return;
    
    setIsGenerating(true);
    
    try {
      // 调用生辰分析API
      const baziResponse = await fetch('/api/bazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: format(date, 'yyyy-MM-dd'),
          birthTime: `${hour.padStart(2, '0')}:00:00`,
          gender: gender,
          note: note
        })
      });

      if (!baziResponse.ok) {
        throw new Error('生辰分析失败');
      }

      const baziData = await baziResponse.json();
      setCurrentBaziData(baziData);

      // 调用图像生成API
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: baziData.prompt,
          style: baziData.style
        })
      });

      if (!imageResponse.ok) {
        throw new Error('图像生成失败');
      }

      const imageData = await imageResponse.json();
      setCurrentImageData(imageData);
      setShowResult(true);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  if (showResult && currentBaziData && currentImageData) {
    return (
      <ResultPage 
        baziData={currentBaziData} 
        imageData={currentImageData}
        onBack={() => setShowResult(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">正在生成您的专属画作</h3>
            <p className="text-slate-300">AI正在分析您的生辰信息并创作艺术作品...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">命画</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">首页</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">画廊</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">关于</a>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              登录
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Crown className="w-4 h-4 mr-1" />
              AI艺术生成器
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              基于生辰信息的
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                专属艺术画作生成器
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              输入您的出生时间，AI将结合传统文化与现代艺术算法，
              <br />
              为您创作独一无二的专属艺术作品。支持多种风格，秒级生成。
            </p>
            
            {/* Input Section */}
            <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    出生日期
                  </label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                          !date && "text-slate-400"
                        )}
                      >
                        {date ? format(date, "yyyy年MM月dd日") : "选择出生日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    出生时间
                  </label>
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className="h-12 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择出生时间" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Array.from({ length: 24 }, (_, i) => {
                        const nextHour = (i + 1) % 24;
                        return (
                          <SelectItem key={i} value={i.toString()} className="text-white hover:bg-slate-700">
                            {i.toString().padStart(2, '0')}:00-{nextHour.toString().padStart(2, '0')}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    性别
                  </label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="male" className="text-white hover:bg-slate-700">男</SelectItem>
                      <SelectItem value="female" className="text-white hover:bg-slate-700">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    备注 <span className="text-slate-400 text-xs">(选填，可指导画作风格、色彩、主题等)</span>
                  </label>
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="例如：希望画作偏向温暖色调，包含自然元素..."
                    className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!date || !hour || !gender || isGenerating}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    正在生成您的专属画作...
                  </div>
                ) : (
                  "生成我的专属画作"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Featured Gallery */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">精选画廊</h2>
              <p className="text-slate-400">探索其他用户创作的精美艺术作品</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="bg-slate-700 border-slate-600"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="bg-slate-700 border-slate-600"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>

          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
          )}>
            {featuredArtworks.map((artwork) => (
              <Card key={artwork.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-200 group">
                <div className="relative">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <Badge 
                    className={cn(
                      "absolute top-3 left-3 text-white border-0",
                      artwork.badgeColor
                    )}
                  >
                    {artwork.badge}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-1">{artwork.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{artwork.prompt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={artwork.avatar} 
                        alt={artwork.user}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-slate-300">{artwork.user}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-400">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {artwork.likes}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {artwork.views}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">命画</span>
              </div>
              <p className="text-slate-400 text-sm">
                结合传统文化与现代AI技术，为每个人创作独特的艺术作品。
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">产品</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">艺术生成</a></li>
                <li><a href="#" className="hover:text-white transition-colors">画廊浏览</a></li>
                <li><a href="#" className="hover:text-white transition-colors">风格定制</a></li>
                <li><a href="#" className="hover:text-white transition-colors">高清下载</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">社区</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">用户作品</a></li>
                <li><a href="#" className="hover:text-white transition-colors">创作分享</a></li>
                <li><a href="#" className="hover:text-white transition-colors">艺术讨论</a></li>
                <li><a href="#" className="hover:text-white transition-colors">创作教程</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">支持</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">反馈建议</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2024 命画. 保留所有权利。
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
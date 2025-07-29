"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Heart, Sparkles, Palette, Clock, User, Share2 } from 'lucide-react';

interface ResultPageProps {
  baziData: any;
  imageData: any;
  onBack: () => void;
}

export function ResultPage({ baziData, imageData, onBack }: ResultPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageData.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `命画作品_${new Date().getTime()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '我的专属命画作品',
          text: '看看我基于生辰信息生成的专属艺术作品！',
          url: window.location.href
        });
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请稍后重试');
    }
  };

  const handleRegenerate = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">命画</span>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Sparkles className="w-4 h-4 mr-1" />
              您的专属画作已生成
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              基于您生辰信息的专属艺术作品
            </h1>
            <p className="text-slate-300 text-lg">
              AI结合传统文化智慧，为您创作的独一无二的艺术画作
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 画作展示 */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <div className="relative">
                  <img 
                    src={imageData.imageUrl} 
                    alt="您的专属画作"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`${isLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} border-0`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {baziData.analysis?.style || '专属艺术作品'}
                      </h3>
                      <p className="text-slate-400">
                        风格：{baziData.style} · 主五行：{baziData.mainWuxing}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isDownloading ? '下载中...' : '下载画作'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRegenerate}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        重新生成
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      分享作品
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 分析结果 */}
            <div className="space-y-6">
              {/* 生辰信息 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">您的生辰信息</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">年柱</p>
                      <p className="text-white font-medium">{baziData.bazi.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">月柱</p>
                      <p className="text-white font-medium">{baziData.bazi.month}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">日柱</p>
                      <p className="text-white font-medium">{baziData.bazi.day}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">时柱</p>
                      <p className="text-white font-medium">{baziData.bazi.hour}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">主要五行</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {baziData.mainWuxing}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 艺术风格分析 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">艺术风格分析</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">性格特质</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {baziData.analysis?.personality}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">艺术方向</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {baziData.analysis?.artDirection}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">推荐色彩</p>
                      <div className="flex flex-wrap gap-2">
                        {baziData.colors?.map((color: string, index: number) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="border-slate-600 text-slate-300"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">情感表达</p>
                      <p className="text-slate-300 text-sm">{baziData.emotion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 创作信息 */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">创作信息</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">创作时间</span>
                      <span className="text-slate-300 text-sm">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">艺术风格</span>
                      <span className="text-slate-300 text-sm">{baziData.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">生成模型</span>
                      <span className="text-slate-300 text-sm">命画 AI v1.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 相关作品推荐 */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">相关艺术作品</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-200">
                  <img 
                    src={`https://images.pexels.com/photos/${1103970 + item * 100}/pexels-photo-${1103970 + item * 100}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                    alt={`相关作品 ${item}`}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h4 className="font-medium text-white mb-1">相似风格作品 {item}</h4>
                    <p className="text-sm text-slate-400">同样基于{baziData.mainWuxing}五行创作</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
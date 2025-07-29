import { NextRequest, NextResponse } from 'next/server';
import { Lunar, Solar } from 'lunar-javascript';

// DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 五行对应的艺术风格
const WUXING_STYLES = {
  '金': {
    colors: ['金色', '白色', '银色', '灰色'],
    style: '简约现代',
    emotion: '坚毅、纯净',
    prompt: 'minimalist modern art with gold and silver tones, clean lines, metallic textures'
  },
  '木': {
    colors: ['绿色', '青色', '蓝绿色'],
    style: '自然写实',
    emotion: '生机、成长',
    prompt: 'natural landscape art with lush green forests, growing plants, vibrant life energy'
  },
  '水': {
    colors: ['蓝色', '黑色', '深蓝色'],
    style: '流动抽象',
    emotion: '智慧、灵动',
    prompt: 'flowing abstract art with water elements, deep blues and blacks, fluid movements'
  },
  '火': {
    colors: ['红色', '橙色', '紫色'],
    style: '热烈表现',
    emotion: '激情、活力',
    prompt: 'passionate expressionist art with warm reds and oranges, dynamic energy, flames'
  },
  '土': {
    colors: ['黄色', '棕色', '土色'],
    style: '厚重古典',
    emotion: '稳重、包容',
    prompt: 'classical art with earth tones, stable composition, grounded and nurturing themes'
  }
};

// 使用DeepSeek生成艺术风格
async function generateArtStyleWithDeepSeek(bazi: any, wuxing: string, gender: string, note: string) {
  if (!DEEPSEEK_API_KEY) {
    console.warn('DeepSeek API key not found, using fallback');
    return WUXING_STYLES[wuxing as keyof typeof WUXING_STYLES] || WUXING_STYLES['土'];
  }

  try {
    const genderText = gender === 'male' ? '男性' : '女性';
    const noteText = note ? `\n用户备注：${note}` : '';
    
    const prompt = `你是一位精通中国传统文化和现代艺术的大师。请根据以下信息生成艺术风格建议：

生辰信息：
- 年柱：${bazi.year}
- 月柱：${bazi.month}
- 日柱：${bazi.day}
- 时柱：${bazi.hour}
- 主要五行：${wuxing}
- 性别：${genderText}${noteText}

请生成一个JSON格式的艺术风格建议，包含以下字段：
- colors: 4个适合的颜色（中文）
- style: 艺术风格描述（中文）
- emotion: 情感表达（中文）
- prompt: 英文艺术生成提示词（详细描述，适合AI绘画）

要求：
1. 结合传统五行理论和现代艺术美学
2. 考虑性别特征，为男性偏向阳刚，为女性偏向柔美
3. 如有用户备注，请在风格中体现相关要求
4. 英文提示词要详细具体，包含风格、色彩、构图、情感等元素
5. 只返回JSON格式，不要其他文字`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content from DeepSeek API');
    }

    // 尝试解析JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const artStyle = JSON.parse(jsonMatch[0]);
        return artStyle;
      }
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', parseError);
    }
    
    // 如果解析失败，返回默认风格
    throw new Error('Failed to parse DeepSeek response');
    
  } catch (error) {
    console.error('DeepSeek API error:', error);
    // 返回基于五行的默认风格
    return WUXING_STYLES[wuxing as keyof typeof WUXING_STYLES] || WUXING_STYLES['土'];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { birthDate, birthTime, gender, note } = await request.json();
    
    if (!birthDate || !birthTime || !gender) {
      return NextResponse.json(
        { error: '请提供完整的出生日期、时间和性别信息' },
        { status: 400 }
      );
    }

    // 解析日期和时间
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour] = birthTime.split(':').map(Number);

    // 转换为农历
    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    
    // 获取八字
    const bazi = {
      year: `${lunar.getYearInGanZhi()}`,
      month: `${lunar.getMonthInGanZhi()}`,
      day: `${lunar.getDayInGanZhi()}`,
      hour: `${lunar.getTimeInGanZhi(hour, 0)}`
    };

    // 分析主要五行（简化版本，实际应该更复杂）
    const ganZhi = [bazi.year, bazi.month, bazi.day, bazi.hour].join('');
    const wuxingCount = {
      '金': (ganZhi.match(/[庚辛申酉]/g) || []).length,
      '木': (ganZhi.match(/[甲乙寅卯]/g) || []).length,
      '水': (ganZhi.match(/[壬癸亥子]/g) || []).length,
      '火': (ganZhi.match(/[丙丁巳午]/g) || []).length,
      '土': (ganZhi.match(/[戊己辰戌丑未]/g) || []).length
    };
    
    const mainWuxing = Object.entries(wuxingCount).reduce((a, b) => 
      wuxingCount[a[0] as keyof typeof wuxingCount] > wuxingCount[b[0] as keyof typeof wuxingCount] ? a : b
    )[0];

    // 使用DeepSeek生成艺术风格
    const artStyle = await generateArtStyleWithDeepSeek(bazi, mainWuxing, gender, note || '');

    const result = {
      bazi,
      mainWuxing,
      analysis: {
        personality: `根据您的生辰信息，您的主要五行属性为${mainWuxing}，这赋予了您独特的性格特质和艺术偏好。`,
        artDirection: `建议的艺术风格融合了${mainWuxing}的特质，体现${artStyle.emotion}的情感表达。`,
        colors: artStyle.colors,
        style: artStyle.style
      },
      prompt: artStyle.prompt,
      style: artStyle.style,
      colors: artStyle.colors,
      emotion: artStyle.emotion
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Bazi analysis error:', error);
    return NextResponse.json(
      { error: '分析过程中出现错误，请稍后重试' },
      { status: 500 }
    );
  }
}
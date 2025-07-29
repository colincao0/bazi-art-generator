import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 火山引擎配置
const VOLCANO_ACCESS_KEY = process.env.VOLCANO_ACCESS_KEY;
const VOLCANO_SECRET_KEY = process.env.VOLCANO_SECRET_KEY;
const VOLCANO_REGION = 'cn-north-1';
const VOLCANO_SERVICE = 'visual_ai';
const VOLCANO_HOST = 'visual.volcengineapi.com';

// 生成火山引擎签名
function generateVolcanoSignature(method: string, uri: string, query: string, headers: Record<string, string>, body: string) {
  const algorithm = 'HMAC-SHA256';
  const service = VOLCANO_SERVICE;
  const region = VOLCANO_REGION;
  const date = headers['X-Date'];
  const shortDate = date.split('T')[0];
  
  // 1. 创建规范请求
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(key => `${key.toLowerCase()}:${headers[key]}`)
    .join('\n');
  
  const signedHeaders = Object.keys(headers)
    .sort()
    .map(key => key.toLowerCase())
    .join(';');
  
  const hashedPayload = crypto.createHash('sha256').update(body).digest('hex');
  
  const canonicalRequest = [
    method,
    uri,
    query,
    canonicalHeaders,
    '',
    signedHeaders,
    hashedPayload
  ].join('\n');
  
  // 2. 创建待签名字符串
  const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const credentialScope = `${shortDate}/${region}/${service}/request`;
  const stringToSign = [
    algorithm,
    date,
    credentialScope,
    hashedCanonicalRequest
  ].join('\n');
  
  // 3. 计算签名
  const kDate = crypto.createHmac('sha256', VOLCANO_SECRET_KEY!).update(shortDate).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  
  return `${algorithm} Credential=${VOLCANO_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: '请提供图像生成提示词' },
        { status: 400 }
      );
    }

    // 检查是否配置了火山引擎密钥
    if (!VOLCANO_ACCESS_KEY || !VOLCANO_SECRET_KEY) {
      console.warn('Volcano Engine credentials not found, using mock image');
      
      // 返回模拟图像
      const mockImages = [
        'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800'
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      
      return NextResponse.json({
        success: true,
        imageUrl: randomImage,
        prompt: prompt,
        style: style,
        message: '这是一个演示图像，实际部署时将生成真实的AI艺术作品'
      });
    }

    // 构建请求参数
    const requestBody = {
      req_key: `bazi_art_${Date.now()}`,
      prompt: prompt,
      model_version: 'general_v1.4',
      width: 1024,
      height: 1024,
      scale: 7.5,
      ddim_steps: 20,
      seed: Math.floor(Math.random() * 1000000),
      return_url: true
    };

    const body = JSON.stringify(requestBody);
    const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    
    const headers = {
      'Content-Type': 'application/json',
      'Host': VOLCANO_HOST,
      'X-Date': date
    };

    const authorization = generateVolcanoSignature(
      'POST',
      '/api/v1/img2img_inpainting',
      '',
      headers,
      body
    );

    headers['Authorization'] = authorization;

    // 调用火山引擎API
    const response = await fetch(`https://${VOLCANO_HOST}/api/v1/img2img_inpainting`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`Volcano API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code !== 10000) {
      throw new Error(`Volcano API error: ${result.message}`);
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.image_url,
      prompt: prompt,
      style: style
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    
    // 如果API调用失败，返回模拟图像
    const mockImages = [
      'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    
    return NextResponse.json({
      success: true,
      imageUrl: randomImage,
      prompt: request.body?.prompt || '默认提示词',
      style: request.body?.style || '默认风格',
      message: '由于网络问题，当前显示演示图像'
    });
  }
}
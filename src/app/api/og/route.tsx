import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'VibeStash';
  const description = searchParams.get('desc') || 'Discover the best vibe-coded apps & products';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          position: 'relative',
        }}
      >
        {/* Gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7c8aff 0%, #a78bfa 50%, #f472b6 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 80px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#7c8aff',
              letterSpacing: '-0.5px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ⚡ VIBESTASH
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? '48px' : '60px',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-2px',
              maxWidth: '900px',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '22px',
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '40px',
              color: '#6b7280',
              fontSize: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#7c8aff', fontWeight: 700, fontSize: '20px' }}>300+</span> Products
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '20px' }}>20+</span> AI Tools
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '20px' }}>Video</span> Previews
            </div>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            color: '#4b5563',
            fontSize: '16px',
          }}
        >
          vibestash.fun
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

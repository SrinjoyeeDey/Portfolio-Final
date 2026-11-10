import React from 'react';
import { createRoot } from 'react-dom/client';
import ElasticMesh from './ElasticMesh';

function ElasticMeshMount() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ElasticMesh
        text={"I craft Ideas\nthrough Design"}
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight={900}
        material="balloon"
        color="#111215"
        theme="light"
        inflate={0.9}
        stiffness={0.52}
        wobble={0.65}
        grabRadius={85}
        stretch={0.45}
        press={0.5}
        shadow={0.35}
        intro={false}
      />
    </div>
  );
}

const container = document.getElementById('elastic-mesh-root');
if (container) {
  const root = createRoot(container);
  root.render(<ElasticMeshMount />);
}

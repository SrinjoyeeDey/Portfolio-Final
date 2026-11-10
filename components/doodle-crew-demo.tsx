"use client";

import DoodleCrewFooter from "./ui/doodle-crew-footer";

export default function DoodleCrewDemo() {
  return (
    <div className="w-full" style={{ backgroundColor: "#ECECE7" }}>
      <DoodleCrewFooter
        wordmark="SRINJOYEE"
        brand="srinjoyee dey"
        blurb="Engineering intelligent systems, AI applications, and community platforms that turn ideas into impact."
        tagline="Code. Create. Connect. Designed and built with heart."
        palette={{ background: "#ECECE7", ink: "#222428", accent: "#FFBD12" }}
        copyright="© 2026 Srinjoyee Dey. All rights reserved."
        legal={[
          { label: "Portfolio", href: "#hero" },
          { label: "Work", href: "#projects" },
          { label: "Memories", href: "#memory-wall" }
        ]}
        socials={[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/srinjoyee-dey/" },
          { label: "GitHub", href: "https://github.com/SrinjoyeeDey/" },
          { label: "X (Twitter)", href: "https://x.com/Srinjoyee__bee" },
          { label: "Substack", href: "https://srinjoyeedey.substack.com" }
        ]}
        backToTop={true}
      />
    </div>
  );
}

import Image from "next/image";
import DesktopBandOverflow from "./DesktopBandOverflow";

const graphics = {
  fan: {
    src: "/images/gukak/home-v2/fan.png",
    width: 1711,
    height: 1477,
    nodeId: "8:402",
  },
  geomungo: {
    src: "/images/gukak/home-v2/geomungo.png",
    width: 1380,
    height: 1363,
    nodeId: "8:405",
  },
  gong: {
    src: "/images/gukak/home-v2/gong.png",
    width: 1414,
    height: 1330,
    nodeId: "8:408",
  },
  janggu: {
    src: "/images/gukak/home-v2/janggu.png",
    width: 1437,
    height: 1686,
    nodeId: "8:411",
  },
} as const;

type GraphicName = keyof typeof graphics;
type BandVariant = "pc-top" | "pc-bottom" | "mo-top" | "mo-bottom";

const bandNodeIds: Record<BandVariant, string> = {
  "pc-top": "12:46304",
  "pc-bottom": "12:46319",
  "mo-top": "8:28050",
  "mo-bottom": "8:28071",
};

function InteractionGraphic({ graphic, original }: { graphic: GraphicName; original: boolean }) {
  const asset = graphics[graphic];

  return (
    <span
      className={`home-graphic home-graphic-${graphic}`}
      data-node-id={original ? asset.nodeId : undefined}
    >
      <span className="home-graphic-motion">
        <Image
          src={asset.src}
          alt=""
          width={asset.width}
          height={asset.height}
          priority
          sizes="(max-width: 700px) 46vw, 23vw"
        />
      </span>
    </span>
  );
}

function DesktopBandCycle({ variant, copy }: { variant: "pc-top" | "pc-bottom"; copy: number }) {
  const isTop = variant === "pc-top";
  const typeNodeIds = isTop
    ? copy === 0
      ? ["8:17", "8:10"]
      : ["12:46334", "12:46340"]
    : copy === 0
      ? ["8:4", "8:23"]
      : ["12:46361", "12:46367"];

  return (
    <div className="home-band-cycle" data-loop-copy={copy}>
      <Image
        className="home-band-type home-band-type-first"
        src={isTop ? "/images/gukak/home-v2/pc-gugak.svg" : "/images/gukak/home-v2/pc-gugak-ghost.svg"}
        alt=""
        width={804}
        height={374}
        priority
        data-node-id={typeNodeIds[0]}
      />
      <Image
        className="home-band-type home-band-type-second"
        src={isTop ? "/images/gukak/home-v2/pc-bizlab-ghost.svg" : "/images/gukak/home-v2/pc-bizlab.svg"}
        alt=""
        width={864}
        height={374}
        priority
        data-node-id={typeNodeIds[1]}
      />

      {isTop ? (
        <>
          <InteractionGraphic graphic="janggu" original={copy === 0} />
          <InteractionGraphic graphic="fan" original={copy === 0} />
        </>
      ) : (
        <>
          <InteractionGraphic graphic="geomungo" original={copy === 0} />
          <InteractionGraphic graphic="gong" original={copy === 0} />
        </>
      )}
    </div>
  );
}

function MobileType({
  className,
  src,
  width,
  nodeId,
}: {
  className: string;
  src: string;
  width: number;
  nodeId: string;
}) {
  return (
    <span className={`home-mobile-type ${className}`} data-node-id={nodeId}>
      <Image src={src} alt="" width={width} height={131} priority />
    </span>
  );
}

function MobileBandCycle({ variant, copy }: { variant: "mo-top" | "mo-bottom"; copy: number }) {
  const isTop = variant === "mo-top";
  const typeNodeIds = isTop
    ? copy === 0
      ? ["8:777", "8:770"]
      : ["8:830", "12:52518"]
    : copy === 0
      ? ["8:764", "8:783"]
      : ["8:817", "12:52533"];

  return (
    <div className="home-band-cycle" data-loop-copy={copy}>
      <MobileType
        className="home-mobile-type-first"
        src={isTop ? "/images/gukak/home-v2/mo-gugak.svg" : "/images/gukak/home-v2/mo-gugak-ghost.svg"}
        width={282}
        nodeId={typeNodeIds[0]}
      />
      <MobileType
        className="home-mobile-type-second"
        src={isTop ? "/images/gukak/home-v2/mo-bizlab-ghost.svg" : "/images/gukak/home-v2/mo-bizlab.svg"}
        width={303}
        nodeId={typeNodeIds[1]}
      />

      {isTop ? (
        <>
          <InteractionGraphic graphic="janggu" original={copy === 0} />
          <InteractionGraphic graphic="fan" original={copy === 0} />
        </>
      ) : (
        <>
          <InteractionGraphic graphic="geomungo" original={copy === 0} />
          <InteractionGraphic graphic="gong" original={copy === 0} />
        </>
      )}
    </div>
  );
}

function LoopingBand({ variant }: { variant: BandVariant }) {
  const isMobile = variant.startsWith("mo-");

  return (
    <div className={`home-band home-band-${variant}`} data-node-id={bandNodeIds[variant]}>
      <div className="home-band-track">
        {[0, 1].map((copy) =>
          isMobile ? (
            <MobileBandCycle variant={variant as "mo-top" | "mo-bottom"} copy={copy} key={copy} />
          ) : (
            <DesktopBandCycle variant={variant as "pc-top" | "pc-bottom"} copy={copy} key={copy} />
          ),
        )}
        {!isMobile && (
          <DesktopBandOverflow>
            <DesktopBandCycle variant={variant as "pc-top" | "pc-bottom"} copy={2} />
          </DesktopBandOverflow>
        )}
      </div>
    </div>
  );
}

export default function HomeBackground() {
  return (
    <>
      <div className="desktop-poster" aria-hidden="true" data-node-id="8:389">
        <div className="poster-background poster-background-pc">
          <Image
            className="poster-pattern poster-pattern-pc"
            src="/images/gukak/home-v2/pattern-pc.svg"
            alt=""
            width={1920}
            height={1430}
            priority
            data-node-id="8:16011"
          />
          <LoopingBand variant="pc-top" />
          <LoopingBand variant="pc-bottom" />
        </div>
      </div>

      <div className="mobile-poster" aria-hidden="true" data-node-id="8:855">
        <div className="poster-background poster-background-mo">
          <Image
            className="poster-pattern poster-pattern-mo"
            src="/images/gukak/home-v2/pattern-mo.svg"
            alt=""
            width={630}
            height={1090}
            priority
            data-node-id="11:27498"
          />
          <LoopingBand variant="mo-top" />
          <LoopingBand variant="mo-bottom" />
        </div>
      </div>
    </>
  );
}

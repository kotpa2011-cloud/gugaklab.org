import Image from "next/image";

import styles from "./OverviewWordBand.module.css";

const rows = [
  [
    { src: "/images/gukak/overview-v2/bizlab-yellow.svg", width: 289, height: 125 },
    { src: "/images/gukak/overview-v2/gugak-purple.svg", width: 269, height: 125 },
    { src: "/images/gukak/overview-v2/bizlab-yellow.svg", width: 289, height: 125 },
  ],
  [
    { src: "/images/gukak/overview-v2/gugak-yellow.svg", width: 269, height: 125 },
    { src: "/images/gukak/overview-v2/bizlab-purple.svg", width: 289, height: 125 },
    { src: "/images/gukak/overview-v2/gugak-yellow.svg", width: 269, height: 125 },
  ],
] as const;

export default function OverviewWordBand({
  assetDirectory = "/images/gukak/overview-v2",
}: { assetDirectory?: string }) {
  return (
    <div className="overview-word-band" aria-hidden="true" data-node-id="25:68363">
      {rows.map((row, rowIndex) => (
        <div
          className={`overview-word-row${rowIndex === 1 ? ` ${styles.offsetRow}` : ""}`}
          data-node-id={rowIndex === 0 ? "25:68364" : "25:68385"}
          key={rowIndex}
        >
          {row.map((item, itemIndex) => (
            <Image
              src={item.src.replace("/images/gukak/overview-v2", assetDirectory)}
              alt=""
              width={item.width}
              height={item.height}
              priority
              key={`${rowIndex}-${itemIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { GoodnightConfig } from "@/config";
import { useEffect, useState } from "react";
import styles from "./goodnight.module.css";
import { Time } from "../time";
import { Date } from "../date";
import { isVisible } from "./utils/isVisible";

type ImageCarouselProps = {
  images: Array<string>;
  speed: number;
  transitionSpeed?: number;
  className?: string;
};

type GoodnightProps = {
  config: GoodnightConfig;
};

export function ImageCarousel({
  images,
  speed,
  transitionSpeed,
}: ImageCarouselProps): React.ReactElement {
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      const nextImage = currentImage + 1;
      if (nextImage >= images.length) {
        setCurrentImage(0);
      } else {
        setCurrentImage(nextImage);
      }
    }, speed * 1000);
    return () => clearInterval(id);
  }, [currentImage, setCurrentImage, speed, images]);

  return (
    <ul className={styles.carousel}>
      {images.map((image, index) => (
        <li key={index} className={styles.imageContainer}>
          <img
            src={image}
            alt=""
            className={`${styles.image} ${
              index === currentImage ? styles.current : ""
            }`}
            style={{ transitionDuration: `${transitionSpeed}s` }}
          />
        </li>
      ))}
    </ul>
  );
}

export function Goodnight({ config }: GoodnightProps): React.ReactElement {
  const { images, background_color, speed, transition_speed, start, end } =
    config;

  const [visible, setVisible] = useState<boolean>(isVisible(start, end));

  useEffect(() => {
    const id = setInterval(() => setVisible(isVisible(start, end)), 500);
    return () => clearInterval(id);
  }, [start, end, visible]);

  return visible === true ? (
    <section
      style={{
        backgroundColor: background_color,
      }}
      className={styles.container}
    >
      {images.length > 0 && (
        <ImageCarousel
          images={images}
          speed={speed}
          transitionSpeed={transition_speed}
        />
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>Goodnight!</h1>
        <Time className={styles.time} />
        <Date className={styles.date} />
      </div>
    </section>
  ) : (
    <></>
  );
}

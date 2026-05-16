"use client";

import React, { useState, useEffect } from "react";
import styles from "./NasaCollaborationPage.module.css";
import RoverPhoto from "./RoverPhoto";

const API_KEY = "fAUaF9bf5GsaS4xhW7G6rtpxSyzA4Y4cYFtPRaka";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const NASA_URLs = {
  astronomyPicOfTheDay: `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`,
  marsRoverPhoto: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-06-03&api_key=${API_KEY}`,
  marsRoverSearch:
    "https://images-api.nasa.gov/search?q=curiosity&media_type=image",
};

export const NasaCollaboration = () => {
  const [dailyImg, setDailyImg] = useState({});
  const [roverPhoto, setRoverPhoto] = useState({ photos: [] });
  const [roverError, setRoverError] = useState(null);

  useEffect(() => {
    fetch(NASA_URLs.astronomyPicOfTheDay)
      .then((res) => res.json())
      .then((data) => {
        setDailyImg(data);
      })
      .catch((err) => console.error("APOD failed:", err));

    const loadRoverPhotos = async () => {
      try {
        const res = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${API_KEY}`,
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        setRoverPhoto({
          photos: data.latest_photos || [],
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Rover failed:", errorMessage);

        try {
          const fallbackRes = await fetch(NASA_URLs.marsRoverSearch);

          if (!fallbackRes.ok) {
            throw new Error("Fallback failed");
          }

          const fallbackData = await fallbackRes.json();

          const fallbackPhotos =
            fallbackData.collection?.items?.slice(0, 8).map((item, index) => {
              const itemData = item.data?.[0] || {};
              const itemLink =
                item.links?.find((link) => link.render === "image") || {};

              return {
                id: itemData.nasa_id || `fallback-${index}`,
                img_src: itemLink.href,
                earth_date: itemData.date_created?.slice(0, 10) || "unknown",
                rover: {
                  name: itemData.photographer || "NASA",
                },
              };
            }) || [];

          setRoverPhoto({
            photos: fallbackPhotos,
          });
        } catch (fallbackErr) {
          const fallbackMessage =
            fallbackErr instanceof Error
              ? fallbackErr.message
              : String(fallbackErr);
          console.error("Rover fallback failed:", fallbackMessage);
          setRoverError("Unable to load rover photos.");
        }
      }
    };

    loadRoverPhotos();
  }, []);

  return (
    <div className={styles.fullBGpicture}>
      <main className={styles.mainContent}>
        <h1>Collaboration with NASA</h1>

        <section className={styles.card}>
          <h2>Astronomy Picture of the day</h2>

          {dailyImg?.url ? (
            <>
              <h3>{dailyImg.title}</h3>

              {dailyImg.media_type === "video" && dailyImg.url ? (
                <iframe
                  src={dailyImg.url || ""}
                  title={dailyImg.title}
                  width="100%"
                  height="400"
                  allowFullScreen
                />
              ) : (
                <img
                  src={dailyImg.hdurl || dailyImg.url}
                  alt={dailyImg.title || "NASA APOD"}
                  className={styles.nasaPicOfTheDayImg}
                  referrerPolicy="no-referrer"
                />
              )}

              <p className={styles.cardDescription}>{dailyImg.explanation}</p>
            </>
          ) : (
            <p>Loading astronomy picture...</p>
          )}
        </section>

        <section className={styles.card}>
          <h2>Rover Photos</h2>

          {roverError ? (
            <p className={styles.cardDescription}>
              Error loading rover photos: {roverError}
            </p>
          ) : roverPhoto?.photos?.length ? (
            <div className={styles.roverGrid}>
              {roverPhoto.photos.map((photo) => (
                <RoverPhoto
                  key={photo.id}
                  src={photo.img_src}
                  date={photo.earth_date}
                  roverName={photo.rover?.name || "NASA"}
                />
              ))}
            </div>
          ) : (
            <p>Loading rover photos...</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default NasaCollaboration;

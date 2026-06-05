"use client";

import { useRef, useState, type MouseEvent } from "react";
import CursorStars from "../background/CursorStars";
import SpaceGradient from "../background/Space";
import BootstrapClient from "../components/BootstrapClient";

const discordHandle = "nrbrt";
const hiddenVideoUrl = "https://i.imgur.com/PntOOl2.mp4";

function fallbackCopyToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textArea);
  return succeeded;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return fallbackCopyToClipboard(text);
    }
  }

  return fallbackCopyToClipboard(text);
}

export default function Home() {
  const [discordLabel, setDiscordLabel] = useState("Discord");
  const [discordClicks, setDiscordClicks] = useState(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleDiscordClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setDiscordClicks((prev) => {
      const next = prev + 1;
      if (next >= 10) {
        window.open(hiddenVideoUrl, "_blank", "noopener,noreferrer");
        return 0;
      }
      return next;
    });

    const copied = await copyToClipboard(discordHandle);
    if (!copied) {
      return;
    }

    setDiscordLabel("Másolva!");
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setDiscordLabel("Discord");
    }, 1000);
  };

  return (
    <>
      <SpaceGradient />
      <CursorStars />
      <main className="main-container">
        <div className="content-wrapper">
          <div className="profile-picture-container">
            <img src="/img/nrbrt.jpg" alt="Profile Picture" className="profile-picture" />
          </div>

          <h2>nrbrt</h2>
          <p></p>
          <div className="button-group">
            <button className="custom-btn" data-bs-toggle="modal" data-bs-target="#aboutModal">
              Rólam
            </button>
            <button className="custom-btn" data-bs-toggle="modal" data-bs-target="#contactModal">
              Kontakt
            </button>
          </div>
        </div>
      </main>

      <div className="modal fade custom-modal" id="aboutModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Rólam</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="about-content">
                <img src="/img/boom.gif" alt="About Me" className="about-image" />
                <p>18 éves kaszinó függő</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade custom-modal" id="contactModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Kapcsolat</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="contact-content">
                <ul className="contact-list">
                  <li>
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:bnrbrt@proton.me" target="_blank" rel="noreferrer">
                      E-mail
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-github"></i>
                    <a href="https://github.com/nrbrtuwu" target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-twitter"></i>
                    <a href="https://x.com/nrbrtt" target="_blank" rel="noreferrer">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-spotify"></i>
                    <a
                      href="https://open.spotify.com/user/31ecunb2h6ekge3rbmffhexi3gfm?si=7ca52cb9072b49a0"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Spotify
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-steam"></i>
                    <a
                      href="https://steamcommunity.com/profiles/76561198360518566/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Steam
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-discord"></i>
                    <a href="#" onClick={handleDiscordClick}>
                      {discordLabel}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BootstrapClient />
    </>
  );
}

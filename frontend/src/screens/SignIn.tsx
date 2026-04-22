import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getHonkStyle } from "../styles/fonts";

interface SignInSchema {
  username: string;
  password: string;
}

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUserSignup = async () => {
    try {
      const data: SignInSchema = {
        username,
        password,
      };
      const response = await axios.post("http://localhost:3000/signin", data);
      if (response.status === 201) {
        navigate("/watch");
      }
    } catch (error) {
      console.error("Signin failed:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-amber-50 flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 39px, #d97706 39px, #d97706 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #d97706 39px, #d97706 40px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Outer card with thick retro border */}
      <div className="w-full max-w-4xl bg-amber-50 border-4 border-black shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row overflow-hidden">
        {/* LEFT COLUMN — Branding */}
        <div className="md:w-5/12 bg-red-600 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center justify-center p-8 gap-6 relative">
          {/* Decorative stars */}
          <div className="absolute top-3 left-3 text-yellow-300 text-2xl select-none">
            ★
          </div>
          <div className="absolute top-3 right-3 text-yellow-300 text-2xl select-none">
            ★
          </div>
          <div className="absolute bottom-3 left-3 text-yellow-300 text-2xl select-none">
            ★
          </div>
          <div className="absolute bottom-3 right-3 text-yellow-300 text-2xl select-none">
            ★
          </div>

          {/* VHS badge */}
          <div className="bg-black text-yellow-300 text-xs font-black tracking-widest px-3 py-1 border-2 border-yellow-300 uppercase">
            ▶ NOW PLAYING
          </div>

          {/* Logo / Title */}
          <div className="sm: w-50 text-center">
            <div
              className="text-yellow-300 font-black uppercase tracking-tight leading-none"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                textShadow: "4px 4px 0px #000, -2px -2px 0px #000",
              }}
            >
              SASTA
            </div>
            <div
              className="bg-yellow-300 text-black font-black uppercase px-2 mt-1"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                textShadow: "3px 3px 0px #b45309",
              }}
            >
              YOUTUBE
            </div>
          </div>

          {/* Tagline */}
          <div className="border-t-2 border-b-2 border-yellow-300 py-2 text-center">
            <p className="text-yellow-100 text-xs font-bold tracking-widest uppercase">
              The Budget Streaming
              <br />
              Experience of 2026
            </p>
          </div>

          {/* Retro TV icon */}
          <div className="text-6xl select-none">📺</div>

          {/* Bottom tape strip */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-300 border-t-2 border-black" />
        </div>

        {/* RIGHT COLUMN — Form */}
        <div className="md:w-7/12 bg-amber-50 p-8 flex flex-col justify-center gap-4">
          {/* Form header */}
          <div className="border-b-4 border-black pb-3 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 border-2 border-black" />
              <div className="w-4 h-4 bg-yellow-400 border-2 border-black" />
              <div className="w-4 h-4 bg-green-500 border-2 border-black" />
              <h2
                className="ml-2 text-2xl font-black uppercase tracking-widest text-black"
                style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
              >
                SIGN UP
              </h2>
            </div>
          </div>

          {/* Input fields */}
          {[
            {
              placeholder: "USERNAME",
              value: username,
              setter: setUsername,
              type: "text",
            },
            {
              placeholder: "PASSWORD",
              value: password,
              setter: setPassword,
              type: "password",
            },
          ].map(({ placeholder, value, setter, type }) => (
            <div key={placeholder} className="relative group">
              <input
                className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm font-bold text-black placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:border-red-600 shadow-[3px_3px_0px_0px_#000] transition-all"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}

          {/* Submit button */}
          <button
            onClick={handleUserSignup}
            className="w-full mt-1 bg-red-600 hover:bg-red-700 active:translate-x-1 active:translate-y-1 active:shadow-none text-white font-black uppercase tracking-widest py-3 border-2 border-black shadow-[4px_4px_0px_0px_#000] transition-all text-sm"
            style={{
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            ▶ HOPP IN! JOIN THE FUN
          </button>

          {/* Sign in link */}
          <p className="text-center text-xs font-bold text-gray-600 mt-1 uppercase tracking-wide">
            Don't have account? Create One{" "}
            <a
              href="/signin"
              className="text-red-600 underline underline-offset-2 hover:text-red-800 font-black"
            >
              SIGN IN
            </a>
          </p>

          {/* Bottom decorative ticker */}
          <div className="mt-2 border-t-2 border-black pt-2 overflow-hidden">
            <p className="text-xs font-mono text-gray-400 tracking-widest truncate">
              ◆ WELCOME TO SASTA YOUTUBE ◆ UPLOAD YOUR VIDEOS ◆ GO VIRAL ◆ MAYBE
              ◆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

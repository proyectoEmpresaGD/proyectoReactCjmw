import { LOGO_URL_DARK } from "../../Constants/constants";

import useLoadingScreenController
    from "./controllers/useLoadingScreenController";

import "./loadingScreen.css";


const snowflakes = [
    { left: "2%", delay: "-2s", duration: "8s", size: "5px", opacity: 0.35, drift: "25px" },
    { left: "6%", delay: "-5s", duration: "11s", size: "9px", opacity: 0.55, drift: "-35px" },
    { left: "11%", delay: "-1s", duration: "7s", size: "4px", opacity: 0.4, drift: "40px" },
    { left: "16%", delay: "-7s", duration: "12s", size: "13px", opacity: 0.75, drift: "-50px" },
    { left: "21%", delay: "-3s", duration: "9s", size: "6px", opacity: 0.45, drift: "35px" },
    { left: "27%", delay: "-8s", duration: "13s", size: "4px", opacity: 0.3, drift: "-20px" },
    { left: "32%", delay: "-4s", duration: "8s", size: "11px", opacity: 0.65, drift: "45px" },
    { left: "37%", delay: "-6s", duration: "10s", size: "5px", opacity: 0.35, drift: "-45px" },
    { left: "42%", delay: "-2.5s", duration: "9s", size: "8px", opacity: 0.5, drift: "30px" },
    { left: "47%", delay: "-9s", duration: "13s", size: "14px", opacity: 0.8, drift: "-35px" },
    { left: "52%", delay: "-5.5s", duration: "8s", size: "5px", opacity: 0.4, drift: "50px" },
    { left: "57%", delay: "-1.5s", duration: "11s", size: "10px", opacity: 0.6, drift: "-40px" },
    { left: "62%", delay: "-7.5s", duration: "12s", size: "4px", opacity: 0.35, drift: "35px" },
    { left: "67%", delay: "-3.5s", duration: "9s", size: "12px", opacity: 0.7, drift: "-45px" },
    { left: "72%", delay: "-8.5s", duration: "13s", size: "6px", opacity: 0.45, drift: "25px" },
    { left: "77%", delay: "-4.5s", duration: "8s", size: "9px", opacity: 0.6, drift: "-35px" },
    { left: "82%", delay: "-6.5s", duration: "11s", size: "4px", opacity: 0.3, drift: "45px" },
    { left: "87%", delay: "-2.2s", duration: "9s", size: "13px", opacity: 0.75, drift: "-50px" },
    { left: "92%", delay: "-7.2s", duration: "12s", size: "5px", opacity: 0.4, drift: "30px" },
    { left: "97%", delay: "-3.2s", duration: "10s", size: "10px", opacity: 0.6, drift: "-30px" },
];


const sparkles = [
    { top: "17%", left: "17%", delay: "0s" },
    { top: "26%", left: "78%", delay: "0.8s" },
    { top: "68%", left: "15%", delay: "1.3s" },
    { top: "74%", left: "82%", delay: "0.4s" },
    { top: "20%", left: "61%", delay: "1.8s" },
    { top: "82%", left: "55%", delay: "1s" },
];


export default function LoadingScreen() {
    const {
        isVisible,
        isLeaving,
    } = useLoadingScreenController();


    if (!isVisible) {
        return null;
    }


    return (
        <div
            className={`
                cjm-loading-screen
                ${isLeaving ? "cjm-loading-screen--leaving" : ""}
            `}
            role="status"
            aria-label="CJM Group"
        >
            <div
                className="cjm-christmas-glow"
                aria-hidden="true"
            />


            <div
                className="cjm-pine cjm-pine--top-left"
                aria-hidden="true"
            >
                <span />
                <span />
                <span />
                <span />
            </div>


            <div
                className="cjm-pine cjm-pine--bottom-right"
                aria-hidden="true"
            >
                <span />
                <span />
                <span />
                <span />
            </div>


            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                "
                aria-hidden="true"
            >
                {sparkles.map(
                    (sparkle, index) => (
                        <span
                            key={index}
                            className="cjm-sparkle"
                            style={{
                                top: sparkle.top,
                                left: sparkle.left,
                                animationDelay: sparkle.delay,
                            }}
                        />
                    )
                )}
            </div>


            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
                aria-hidden="true"
            >
                {snowflakes.map(
                    (snowflake, index) => (
                        <span
                            key={index}
                            className="cjm-snowflake"
                            style={{
                                "--snow-left":
                                    snowflake.left,

                                "--snow-delay":
                                    snowflake.delay,

                                "--snow-duration":
                                    snowflake.duration,

                                "--snow-size":
                                    snowflake.size,

                                "--snow-opacity":
                                    snowflake.opacity,

                                "--snow-drift":
                                    snowflake.drift,
                            }}
                        >
                            ❄
                        </span>
                    )
                )}
            </div>


            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    items-center
                    justify-center
                    px-6
                    text-center
                "
            >
                <div
                    className="cjm-star"
                    aria-hidden="true"
                >
                    ✦
                </div>


                <div className="cjm-loading-logo-frame">
                    <div className="cjm-loading-logo-wrapper">
                        <img
                            src={LOGO_URL_DARK}
                            alt="CJM Group"
                            className="
                                h-auto
                                w-40
                                object-contain
                                sm:w-52
                                lg:w-60
                            "
                        />
                    </div>
                </div>


                <div className="cjm-loading-line">
                    <span />
                </div>


                <p className="cjm-christmas-title">
                    CJM Group
                </p>


                <p className="cjm-christmas-subtitle">
                    Happy Holidays
                </p>
            </div>


            <div
                className="cjm-bottom-decoration"
                aria-hidden="true"
            >
                <span />
                <i>✦</i>
                <span />
            </div>
        </div>
    );
}
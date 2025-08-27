import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class BiografieAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.animateHeaderElements();
    this.animateBioSection();
  }

  animateHeaderElements() {
    // Animate main title
    gsap.fromTo(
      ".site-title",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    // Animate navigation
    gsap.fromTo(
      ".nav-link",
      {
        y: -30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.3,
      }
    );
  }

  animateBioSection() {
    // Animate bio section container
    gsap.fromTo(
      '[data-aos="fade-up"]',
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bio-section",
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate image from left
    gsap.fromTo(
      '[data-aos="fade-right"]',
      {
        x: -100,
        opacity: 0,
        scale: 0.9,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bio-image-left",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate text container from right
    gsap.fromTo(
      '[data-aos="fade-left"]',
      {
        x: 100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bio-text-right",
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate bio title with zoom effect
    gsap.fromTo(
      '[data-aos="zoom-in"]',
      {
        scale: 0.5,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".bio-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate paragraphs with staggered delays based on data-aos-delay
    const paragraphs = document.querySelectorAll(
      '.bio-text-right p[data-aos="fade-up"]'
    );
    paragraphs.forEach((p, index) => {
      const delay = parseInt(p.getAttribute("data-aos-delay")) || 0;

      gsap.fromTo(
        p,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
          delay: delay / 1000 - 0.4, // Convert ms to seconds and adjust base delay
        }
      );
    });
  }
}

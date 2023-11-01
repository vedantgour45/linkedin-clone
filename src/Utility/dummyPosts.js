import lazyLoading from "./Post-Images/lazy-loading.png";
import cssGrid from "./Post-Images/css-grid.png";
import cssFlex from "./Post-Images/css-flexbox.png";

const dummyPosts = [
  {
    name: "Shubham Soni",
    description:
      "Frontend Engineer-II @Amazon | 75K+ linkedin | Career Advisor | 21M+ content views | Mentor | Freelancer",
    caption:
      "Responsive Web Design Made Easy with CSS Grid\n\nCSS Grid is a game-changer in responsive web design. In this post, we delve into CSS Grid's capabilities, demonstrating how it simplifies layout design. You'll learn about grid containers, grid items, and various layout techniques. Say goodbye to complex float-based layouts and embrace the power of CSS Grid. Create responsive web applications that adapt beautifully to different screen sizes and devices.",
    image: cssGrid,
    video: "",
    date: "2023-10-28",
  },
  {
    name: "Aniket Khandelwal",
    description: "Frontend Developer @ Plivo | Imagine to Create",
    caption:
      "Creating a Simple HTML5 Webpage: Step-by-Step Guide\n\nHTML5 is the foundation of web development. This post provides a step-by-step guide to creating a basic HTML5 webpage. You'll learn about HTML elements, document structure, and best practices. Whether you're a beginner or need a refresher, this guide ensures you have a strong grasp of HTML. Start your web development journey by mastering the building blocks of the web.",
    image: "",
    video: "https://www.youtube.com/watch?v=PlxWf493en4",
    date: "2023-10-27",
  },
  {
    name: "Akshay Saini",
    description: "Founder, NamasteDev | Teacher | YouTuber",
    caption: `💎 React Lazy Loading

      ⛱ In React.js, this technique is used to improve application performance by loading components only on demand, that is, only when they are really needed. And this is done using the resources: lazy (React.lazy() function )and Suspense (Component).
      
      ❤️️ Give it a like if you think it's helpful! 👍`,
    image: lazyLoading,
    video: "",
    date: "2023-10-25",
  },
  {
    name: "Bhavika Sharma",
    description: "Learning new skills",
    caption:
      "React vs. Angular: Choosing the Right Frontend Framework\n\nChoosing the right frontend framework is crucial for web development projects. In this post, we compare React and Angular, two popular options. We explore their strengths, weaknesses, and use cases. Whether you prioritize flexibility or an opinionated structure, this comparison will help you make an informed decision. Select the framework that best aligns with your project goals.",
    image: "",
    video: "https://www.youtube.com/watch?v=CynLOUL9vsU",
    date: "2023-10-26",
  },
  {
    name: "Bob Barnard",
    description: "Frontend Developer | React redux, Web Design, JavaScript",
    caption:
      "Unlocking the Power of CSS Flexbox: A Comprehensive Guide\n\nCSS Flexbox is a layout model that simplifies the design of complex web layouts. This comprehensive guide dives deep into the world of Flexbox. Learn about containers, items, alignment, and responsive design. With Flexbox, you can achieve intricate layouts with minimal code. Enhance your web design skills and create visually stunning web pages.",
    image: cssFlex,
    video: "",
    date: "2023-10-25",
  },
];

export default dummyPosts;

import { 
  Code2, 
  Palette, 
  Database, 
  Layout, 
  Settings, 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  PenTool, 
  BarChart3,
  Lightbulb,
  Rocket,
  Mail,
  MessageSquare,
  BrainCircuit,
  Globe,
  Zap,
  HardDrive,
  Cloud,
  ShoppingBag,
  FileText,
  Compass,
  Lock,
  LifeBuoy,
  Link2,
  Briefcase
} from "lucide-react";
import { Service, ProcessStep, NavLink, JobRole } from "../types";

export const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Career", href: "/careers" },
  { name: "Contact", href: "#contact" },
];

export const SERVICES: Service[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    description: "Enterprise software and business automation tools tailored to your unique requirements.",
    longDescription: [
      "We build tailor-made software solutions that address your specific business challenges and drive operational efficiency.",
      "From enterprise-level resource planning to specialized automation tools, our custom software is built to scale with your growth."
    ],
    icon: Code2,
    process: [
      { title: "Discovery", description: "In-depth analysis of business processes and pain points." },
      { title: "Planning", description: "Defining project scope, architecture, and technology stack." },
      { title: "Iterative Development", description: "Building the solution in agile sprints with regular feedback." },
      { title: "Testing", description: "Comprehensive QA to ensure stability and performance." },
      { title: "Deployment", description: "Careful rollout and integration into existing systems." }
    ],
    features: [
      "Enterprise Software",
      "Business Automation Tools",
      "Internal Business Systems",
      "Scalable Architecture",
      "Legacy System Modernization"
    ]
  },
  {
    slug: "web-application-development",
    title: "Web Application Development",
    description: "High-performance full-stack web apps, PWAs, and complex SaaS platforms.",
    longDescription: [
      "Our web applications are built for performance, security, and scalability. We use modern frameworks to create immersive user experiences.",
      "Whether you need an admin dashboard or a multi-tenant SaaS platform, we deliver solutions that perform flawlessly at scale."
    ],
    icon: Globe,
    process: [
      { title: "Requirement Gathering", description: "Defining the functional and non-functional requirements." },
      { title: "Architecture", description: "Designing the frontend and backend structure." },
      { title: "Development", description: "Coding with the latest web standards and frameworks." },
      { title: "Quality Assurance", description: "Extensive cross-browser and performance testing." },
      { title: "Launch", description: "Deploying to production with CI/CD pipelines." }
    ],
    features: [
      "Full-Stack Web Apps",
      "Progressive Web Apps (PWA)",
      "Admin Dashboards",
      "SaaS Platforms",
      "Real-time Web Features"
    ]
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description: "Expertly crafted Android, iOS, and cross-platform mobile experiences.",
    longDescription: [
      "We create mobile applications that offer native-level performance and intuitive user interfaces.",
      "Our cross-platform approach using Flutter or React Native allows for faster time-to-market without compromising quality."
    ],
    icon: Smartphone,
    process: [
      { title: "Mobile Strategy", description: "Defining the platform strategy and user journey." },
      { title: "UX/UI Design", description: "Crafting mobile-first interfaces." },
      { title: "App Development", description: "Building with Flutter, React Native, or Native tools." },
      { title: "Beta Testing", description: "Gathering early feedback from real users." },
      { title: "Store Submission", description: "Managing App Store and Play Store guidelines." }
    ],
    features: [
      "Android Apps",
      "iOS Apps",
      "Cross-platform (Flutter)",
      "App Maintenance",
      "Push Notifications"
    ]
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description: "User-centric design systems that balance aesthetic beauty with functional clarity.",
    longDescription: [
      "Design is at the heart of everything we build. We create user journeys that are both beautiful and intuitive.",
      "Our research-driven design process ensures that your product resonates with your target audience."
    ],
    icon: Palette,
    process: [
      { title: "User Research", description: "Understanding audience needs and behaviors." },
      { title: "Wireframing", description: "Creating the logical layout of the experience." },
      { title: "Visual Design", description: "Applying colors, typography, and brand identity." },
      { title: "Prototyping", description: "Creating interactive mockups for testing." },
      { title: "Design Handoff", description: "Preparing assets for the development team." }
    ],
    features: [
      "Wireframing",
      "Interactive Prototyping",
      "User Research",
      "Design Systems",
      "Visual Brand Identity"
    ]
  },
  {
    slug: "frontend-development",
    title: "Frontend Development",
    description: "Interactive and responsive interfaces built with React, Next.js, and modern styling.",
    longDescription: [
      "Our frontend experts build interfaces that are fast, accessible, and highly interactive.",
      "We focus on performance optimization to ensure your site loads instantly and runs smoothly on all devices."
    ],
    icon: Layout,
    process: [
      { title: "Component Design", description: "Building modular and reusable UI components." },
      { title: "Logic Integration", description: "Connecting the interface to APIs and state management." },
      { title: "Styling", description: "Implementing pixel-perfect layouts with Tailwind or CSS." },
      { title: "Optimization", description: "Minimizing bundle sizes and optimizing assets." },
      { title: "Compatibility Testing", description: "Ensuring cross-device and cross-browser support." }
    ],
    features: [
      "React / Next.js Apps",
      "Responsive Design",
      "Performance Optimization",
      "Animation & Interaction",
      "Web Accessibility"
    ]
  },
  {
    slug: "backend-development",
    title: "Backend Development",
    description: "Powerful server-side logic and highly secure data handling systems.",
    longDescription: [
      "The backbone of your application is built with security and efficiency in mind.",
      "We design robust server-side architectures that handle complex business logic and high data loads effortlessly."
    ],
    icon: Database,
    process: [
      { title: "Schema Design", description: "Defining the data structure and relationships." },
      { title: "API Architecture", description: "Designing the communication layer." },
      { title: "Core Logic", description: "Implementing business rules and algorithms." },
      { title: "Security Implementation", description: "Securing routes and data with authentication." },
      { title: "Performance Tuning", description: "Optimizing database queries and server response times." }
    ],
    features: [
      "Server-side Logic",
      "API Development",
      "Authentication Systems",
      "Business Logic Handling",
      "Microservices Architecture"
    ]
  },
  {
    slug: "api-development-integration",
    title: "API Development & Integration",
    description: "Seamless connectivity through custom REST/GraphQL APIs and third-party integrations.",
    longDescription: [
      "Connect your digital ecosystem with powerful and well-documented APIs.",
      "We specialize in integrating payment gateways, social platforms, and custom enterprise services."
    ],
    icon: Zap,
    process: [
      { title: "Interface Design", description: "Defining API endpoints and data formats." },
      { title: "Security Protocols", description: "Implementing OAuth, JWT, or API keys." },
      { title: "Custom Logic", description: "Building the processing layer for API calls." },
      { title: "Integration Testing", description: "Ensuring smooth data flow between services." },
      { title: "Documentation", description: "Providing clear guides for developer implementation." }
    ],
    features: [
      "REST APIs",
      "GraphQL APIs",
      "Third-party Integrations",
      "Payment API Integration",
      "Real-time Webhooks"
    ]
  },
  {
    slug: "database-solutions",
    title: "Database Solutions",
    description: "Optimized data storage strategies, migration, and high-performance recovery systems.",
    longDescription: [
      "Data is your most valuable asset. We ensure it's stored securely and accessed efficiently.",
      "From SQL to NoSQL, we design database architectures that grow with your application's requirements."
    ],
    icon: HardDrive,
    process: [
      { title: "Data Modeling", description: "Designing efficient schemas for your specific use case." },
      { title: "Implementation", description: "Setting up and configuring database instances." },
      { title: "Optimization", description: "Indexing and query optimization for speed." },
      { title: "Migration", description: "Safely moving data from legacy systems." },
      { title: "Backup Strategy", description: "Setting up automated recovery and backup systems." }
    ],
    features: [
      "Database Design",
      "Optimization",
      "Data Migration",
      "Backup & Recovery",
      "High Availability Setup"
    ]
  },
  {
    slug: "cloud-services",
    title: "Cloud Services",
    description: "Scalable cloud infrastructures and serverless architectures on AWS, Azure, and GCP.",
    longDescription: [
      "Leverage the power of the cloud to reduce operational costs and increase scalability.",
      "We help you transition to cloud-native architectures that provide global reach and high availability."
    ],
    icon: Cloud,
    process: [
      { title: "Cloud Strategy", description: "Determining the best provider and architecture." },
      { title: "Environment Setup", description: "Configuring VPCs, instances, and storage." },
      { title: "Migration", description: "Moving applications and data to the cloud." },
      { title: "Serverless Implementation", description: "Using Lambda or Functions for cost efficiency." },
      { title: "Security Hardening", description: "Implementing cloud-native security controls." }
    ],
    features: [
      "AWS / Azure Setup",
      "Cloud Migration",
      "Serverless Architecture",
      "Cloud Security",
      "Cost Optimization"
    ]
  },
  {
    slug: "devops-services",
    title: "DevOps Services",
    description: "Automated deployment pipelines and modern infrastructure orchestration.",
    longDescription: [
      "Speed up your release cycles with automated CI/CD and containerized environments.",
      "We implement DevOps practices that bridge the gap between development and operations for maximum efficiency."
    ],
    icon: Cpu,
    process: [
      { title: "Pipeline Design", description: "Mapping out the automated build and test flow." },
      { title: "Automation", description: "Implementing infrastructure as code (IaC)." },
      { title: "Containerization", description: "Using Docker and Kubernetes for orchestration." },
      { title: "CI/CD Implementation", description: "Setting up Jenkins, GitHub Actions, or GitLab CI." },
      { title: "Monitoring", description: "Configuring real-time alerts and logging." }
    ],
    features: [
      "CI/CD Pipelines",
      "Docker & Kubernetes",
      "Deployment Automation",
      "Monitoring & Logging",
      "Infrastructure as Code"
    ]
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    description: "Conversion-optimized online stores built on Shopify, WooCommerce, or custom platforms.",
    longDescription: [
      "Drive sales with e-commerce solutions that offer a seamless shopping journey.",
      "We focus on fast checkout, mobile optimization, and secure payment processing to maximize ROI."
    ],
    icon: ShoppingBag,
    process: [
      { title: "E-commerce Strategy", description: "Planning the inventory and sales flow." },
      { title: "Store Setup", description: "Configuring the chosen platform or custom build." },
      { title: "UX Optimization", description: "Tailoring the shopping cart and checkout experience." },
      { title: "Payment Integration", description: "Setting up secure payment gateways." },
      { title: "Inventory Setup", description: "Integrating catalogs and stock management." }
    ],
    features: [
      "Shopify Development",
      "WooCommerce Stores",
      "Custom E-commerce Platforms",
      "Checkout Optimization",
      "Multi-currency Support"
    ]
  },
  {
    slug: "cms-development",
    title: "CMS Development",
    description: "User-friendly content management systems including WordPress and modern headless solutions.",
    longDescription: [
      "Empower your marketing team with easy-to-use content management tools.",
      "We build flexible CMS solutions that give you complete control over your site's content without coding."
    ],
    icon: FileText,
    process: [
      { title: "Platform Selection", description: "Choosing between WordPress, Strapi, or Custom." },
      { title: "Configuration", description: "Setting up content types and taxonomies." },
      { title: "Design Integration", description: "Mapping the design to CMS templates." },
      { title: "Custom Plugin Development", description: "Building unique features for the platform." },
      { title: "Editor Training", description: "Ensuring your team can manage content confidently." }
    ],
    features: [
      "WordPress Development",
      "Headless CMS (Strapi/Sanity)",
      "Custom CMS Solutions",
      "Content Management Tools",
      "SEO-friendly Architecture"
    ]
  },
  {
    slug: "website-design-redesign",
    title: "Website Design & Redesign",
    description: "Refreshing your digital presence with modern layouts that drive conversions.",
    longDescription: [
      "Your website is your digital storefront. We make sure it represents your brand perfectly.",
      "Our redesign service focuses on modernizing your look while significantly improving user engagement."
    ],
    icon: Compass,
    process: [
      { title: "Audit", description: "Identifying weaknesses in your current site." },
      { title: "Visual Strategy", description: "Defining the new look and feel." },
      { title: "Modern Design", description: "Creating interactive and accessible layouts." },
      { title: "UX Improvements", description: "Fixing usability issues and friction points." },
      { title: "Conversion Planning", description: "Strategic placement of CTAs and lead magnets." }
    ],
    features: [
      "Corporate Websites",
      "Landing Pages",
      "UX Improvement",
      "Conversion Optimization",
      "Accessible Design"
    ]
  },
  {
    slug: "software-testing-qa",
    title: "Software Testing & QA",
    description: "End-to-end quality assurance to ensure bug-free and highly reliable systems.",
    longDescription: [
      "We leave no stone unturned when it comes to quality. Our QA team ensures your software works perfectly under all conditions.",
      "Our testing processes are integrated into the development lifecycle for early bug detection."
    ],
    icon: ShieldCheck,
    process: [
      { title: "Test Planning", description: "Defining the test strategy and environments." },
      { title: "Manual Testing", description: "Human-driven exploration of the application." },
      { title: "Automated Testing", description: "Writing scripts for repetitive and regression tests." },
      { title: "Performance Testing", description: "Checking system behavior under load." },
      { title: "Defect Tracking", description: "Rigorous reporting and verification of fixes." }
    ],
    features: [
      "Manual Testing",
      "Automated Testing",
      "Performance Testing",
      "Bug Tracking",
      "User Acceptance Testing"
    ]
  },
  {
    slug: "cybersecurity-services",
    title: "Cybersecurity Services",
    description: "Comprehensive audits, vulnerability testing, and advanced data protection strategies.",
    longDescription: [
      "In an era of increasing threats, keep your business safe with expert cybersecurity protection.",
      "We conduct deep-dive audits and implement proactive defenses to protect your most sensitive data."
    ],
    icon: Lock,
    process: [
      { title: "Security Audit", description: "Detailed analysis of current security posture." },
      { title: "Vulnerability Scanning", description: "Automated testing for known security flaws." },
      { title: "Penetration Testing", description: "Ethical hacking simulation to find backdoors." },
      { title: "Remediation", description: "Implementing fixes for discovered vulnerabilities." },
      { title: "Compliance", description: "Ensuring adherence to industry security standards." }
    ],
    features: [
      "Security Audits",
      "Vulnerability Testing",
      "Data Protection",
      "Secure Coding Practices",
      "Incident Response Planning"
    ]
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Support",
    description: "Reliable post-launch support including bug fixes, system updates, and monitoring.",
    longDescription: [
      "Technology requires constant care. We provide reliable support to keep your systems running optimally.",
      "Our maintenance services include proactive updates and rapid response to any technical issues."
    ],
    icon: LifeBuoy,
    process: [
      { title: "Service Level Agreement", description: "Defining response times and support scope." },
      { title: "24/7 Monitoring", description: "Continuous tracking of system health." },
      { title: "Proactive Updates", description: "Regularly patching software and dependencies." },
      { title: "Technical Support", description: "Expert assistance for your team's technical queries." },
      { title: "Performance Audits", description: "Occasional deep-dives to keep speed high." }
    ],
    features: [
      "Bug Fixing",
      "System Updates",
      "Performance Monitoring",
      "Technical Support",
      "Security Patching"
    ]
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    description: "Intelligent automation through chatbots, recommendation engines, and data analysis.",
    longDescription: [
      "Bring the future to your business with bespoke AI and Machine Learning models.",
      "We build systems that learn and adapt, providing you with a significant competitive advantage."
    ],
    icon: BrainCircuit,
    process: [
      { title: "Data Discovery", description: "Analyzing available data for AI opportunities." },
      { title: "Model Design", description: "Selecting algorithms and training architectures." },
      { title: "Training & Validation", description: "Developing models with high accuracy thresholds." },
      { title: "Integration", description: "Embedding AI into your existing software workflows." },
      { title: "Maintenance", description: "Continuous learning and model retraining." }
    ],
    features: [
      "Chatbot Development",
      "Recommendation Systems",
      "Data Analysis",
      "AI Strategy & Integration",
      "Natural Language Processing"
    ]
  },
  {
    slug: "blockchain-development",
    title: "Blockchain Development",
    description: "Decentralized solutions including smart contracts, DApps, and crypto integrations.",
    longDescription: [
      "Explore the potential of Web3 with our comprehensive blockchain development services.",
      "We build secure, transparent, and decentralized systems that redefine trust in digital applications."
    ],
    icon: Link2,
    process: [
      { title: "Web3 Discovery", description: "Evaluating blockchain use cases for your business." },
      { title: "Architecture", description: "Designing smart contracts and consensus protocols." },
      { title: "Smart Contract Build", description: "Writing secure code for decentralized logic." },
      { title: "Security Audit", description: "Third-party validation of smart contract security." },
      { title: "DApp Deployment", description: "Launching decentralized apps on chosen networks." }
    ],
    features: [
      "Smart Contracts",
      "DApps Development",
      "Crypto Wallet Integration",
      "Web3 Solutions",
      "Symbolic Logic Verification"
    ]
  },
  {
    slug: "erp-crm-solutions",
    title: "ERP & CRM Solutions",
    description: "Custom business management tools for inventory, HR, and customer relationships.",
    longDescription: [
      "Centralize your business operations with powerful ERP and CRM management systems.",
      "We help you streamline internal processes and improve customer relationships with data-driven tools."
    ],
    icon: Briefcase,
    process: [
      { title: "Business Mapping", description: "Visualizing all operational workflows." },
      { title: "System Selection", description: "Evaluating existing platforms vs custom builds." },
      { title: "Development", description: "Building the custom ERP/CRM application." },
      { title: "Data Integration", description: "Connecting all business data sources." },
      { title: "Implementation Support", description: "Onboarding employees and refining workflows." }
    ],
    features: [
      "Business Management Systems",
      "Customer Relationship Tools",
      "Inventory Systems",
      "HR Management Systems",
      "Integrated Analytics"
    ]
  },
  {
    slug: "it-consulting-strategy",
    title: "IT Consulting & Strategy",
    description: "Strategic roadmaps and digital transformation advice for startups and enterprises.",
    longDescription: [
      "Navigate the complex world of technology with expert strategic advice.",
      "We help you plan your product roadmap and select the right tech stack for long-term success."
    ],
    icon: Lightbulb,
    process: [
      { title: "Strategic Audit", description: "Evaluating current state vs business goals." },
      { title: "Opportunity Mapping", description: "Identifying high-value tech improvements." },
      { title: "Technical Roadmap", description: "Defining the timeline for digital evolution." },
      { title: "Technology Selection", description: "Choosing future-proof tools and stacks." },
      { title: "Implementation Oversight", description: "Guiding the project to successful completion." }
    ],
    features: [
      "Digital Transformation",
      "Technology Consulting",
      "Product Roadmap",
      "Startup MVP Planning",
      "Cost-Benefit Analysis"
    ]
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  { title: "Idea", icon: Lightbulb, description: "Conceptualizing the core vision." },
  { title: "Design", icon: Palette, description: "Crafting the visual blueprint." },
  { title: "Development", icon: Code2, description: "Building the robust solution." },
  { title: "Testing", icon: ShieldCheck, description: "Ensuring flawless performance." },
  { title: "Launch", icon: Rocket, description: "Deploying to the world." },
];

export const CAREER_ROLES: JobRole[] = [
  {
    title: "Full-Stack Developer",
    description: "Build both frontend and backend systems with scalable architecture.",
    icon: Code2,
    category: "Development",
  },
  {
    title: "UI/UX Designer",
    description: "Design beautiful and intuitive user experiences for web and mobile apps.",
    icon: Palette,
    category: "Design",
  },
  {
    title: "Backend Developer",
    description: "Develop secure APIs, manage databases, and ensure system performance.",
    icon: Database,
    category: "Development",
  },
  {
    title: "Frontend Developer",
    description: "Create responsive and interactive user interfaces for modern web apps.",
    icon: Layout,
    category: "Development",
  },
  {
    title: "Product Manager",
    description: "Define product vision, roadmap, and coordinate between teams.",
    icon: Settings,
    category: "Management",
  },
  {
    title: "QA Engineer",
    description: "Test applications, find bugs, and ensure high-quality releases.",
    icon: ShieldCheck,
    category: "Development",
  },
  {
    title: "DevOps Engineer",
    description: "Manage cloud infrastructure, CI/CD pipelines, and deployments.",
    icon: Cpu,
    category: "Development",
  },
  {
    title: "Mobile App Developer",
    description: "Build Android and iOS applications with smooth performance.",
    icon: Smartphone,
    category: "Development",
  },
  {
    title: "Technical Content Writer",
    description: "Write documentation, guides, and technical blog content.",
    icon: PenTool,
    category: "Management",
  },
  {
    title: "Business Analyst",
    description: "Analyze client requirements and translate them into technical solutions.",
    icon: BarChart3,
    category: "Management",
  },
];

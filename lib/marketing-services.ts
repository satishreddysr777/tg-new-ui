





export type Service = {
  slug: string;
  num: string;
  navLabel: string;
  navSub: string;
  footerLabel: string;
  indexTitle: string;
  title: string;
  tagline: string;
  image: string;
  imageLabel: string;
  bullets: { t: string; d: string }[];
  link: string;
  lead: string;
  overview: string[];
  deliver: { t: string; d: string }[];
  chips: string[];
  featureTitle: string;
  featureBody: string;
  featureImageLabel: string;
  seoTitle: string;
};

export const services: Service[] = [
  {
    slug: "cloud",
    num: "01",
    navLabel: "Cloud Solutions & Data Analytics",
    navSub: "Architect, scale & optimize cloud",
    footerLabel: "Cloud & Data Analytics",
    indexTitle: "Cloud Solutions & Data Analytics",
    title: "Cloud Solutions & Data Analytics",
    tagline: "Architect. Scale. Transform.",
    image: "/images/svc-cloud.jpg",
    imageLabel: "Cloud architecture & data pipeline",
    bullets: [
      { t: "AWS · Azure · Google Cloud", d: "Certified experts in architecture, security, DevOps, and scalability." },
      { t: "Data Engineering & Warehousing", d: "From ingestion to transformation and visualization." },
      { t: "Real-Time Analytics", d: "Turn insights into action with low-latency, high-impact dashboards." },
    ],
    link: "Explore Cloud Solutions & Data Analytics →",
    lead: "Whether you're migrating legacy systems or building cloud-native applications, our certified cloud professionals help you design, deploy, and optimize infrastructure that grows with your business.",
    overview: [
      "Whether you're migrating legacy systems or building cloud-native applications, our certified cloud professionals help you design, deploy, and optimize infrastructure that grows with your business — from security to cost efficiency.",
      "On top of that infrastructure, our data engineers and analysts build the layer that makes it pay off: real-time pipelines, scalable warehouses, and intuitive dashboards so you move at the speed of insight.",
    ],
    deliver: [
      { t: "AWS · Azure · Google Cloud", d: "Certified experts in architecture, security, DevOps, and scalability — designing environments that are resilient, compliant, and cost-aware." },
      { t: "Data Engineering & Warehousing", d: "From ingestion to transformation and visualization — modern pipelines and warehouses that turn raw data into a trusted asset." },
      { t: "Real-Time Analytics", d: "Turn insights into action with low-latency, high-impact dashboards that put live data in front of decision-makers." },
    ],
    chips: ["AWS", "Azure", "Google Cloud", "Terraform", "Kubernetes", "Snowflake", "Databricks", "Apache Airflow", "dbt", "Apache Spark"],
    featureTitle: "Cloud investments that deliver maximum return.",
    featureBody: "We architect for agility and optimize for cost — so every dollar of cloud spend pulls its weight.",
    featureImageLabel: "Cloud architecture · live dashboard",
    seoTitle: "Cloud Solutions & Data Analytics Talent | Technograph",
  },
  {
    slug: "aem",
    num: "02",
    navLabel: "Adobe Experience Manager",
    navSub: "Content platforms at scale",
    footerLabel: "Adobe Experience Manager",
    indexTitle: "AEM & Content Platforms",
    title: "Adobe Experience Manager",
    tagline: "Deliver immersive digital experiences at scale.",
    image: "/images/svc-aem.jpg",
    imageLabel: "Digital experience · content platform",
    bullets: [
      { t: "Centralize digital assets & campaigns", d: "One source of truth for every brand touchpoint." },
      { t: "Personalize customer journeys", d: "Tailored experiences across every channel." },
      { t: "Integrate with marketing, CRM & eCommerce", d: "Every interaction seamless, data-informed, and on-brand." },
    ],
    link: "Explore Adobe Experience Manager →",
    lead: "Our AEM consultants craft seamless content ecosystems — centralizing assets, personalizing journeys, and integrating with your MarTech stack.",
    overview: [
      "Adobe Experience Manager is only as powerful as the people who run it. Our AEM consultants architect content ecosystems that let marketing teams move fast without breaking the brand.",
      "From Sites and Assets to headless delivery, personalization and analytics, we integrate AEM with your marketing, CRM and commerce stack so every interaction is data-informed.",
    ],
    deliver: [
      { t: "Centralize digital assets & campaigns", d: "One source of truth for every brand touchpoint — governed, searchable, and reusable across channels." },
      { t: "Personalize customer journeys", d: "Tailored experiences across every channel, powered by Target, Analytics and audience data." },
      { t: "Integrate with marketing, CRM & eCommerce", d: "Every interaction seamless, data-informed, and on-brand across your MarTech stack." },
    ],
    chips: ["Adobe Experience Manager", "Adobe Target", "Adobe Analytics", "Adobe Campaign", "AEM Assets", "AEM Sites", "AEM Forms", "Headless / SPA"],
    featureTitle: "Every interaction, seamless and on-brand.",
    featureBody: "We unify content, data, and design so your digital experience feels effortless — at any scale.",
    featureImageLabel: "Personalized digital experience",
    seoTitle: "Adobe Experience Manager Consultants | Technograph",
  },
  {
    slug: "big-data",
    num: "03",
    navLabel: "Big Data Solutions",
    navSub: "Pipelines, ETL & analytics",
    footerLabel: "Big Data Solutions",
    indexTitle: "Big Data Solutions",
    title: "Big Data Solutions",
    tagline: "Unlock the power inside your data.",
    image: "/images/svc-bigdata.jpg",
    imageLabel: "Big data cluster · processing",
    bullets: [
      { t: "Hadoop · Spark · Kafka · NoSQL", d: "Deep expertise across the modern data stack." },
      { t: "Architecture, ETL & pipeline management", d: "End-to-end, from structured to unstructured, batch to stream." },
      { t: "Predictive analytics & ML readiness", d: "Activate massive datasets across industries." },
    ],
    link: "Explore Big Data Solutions →",
    lead: "Data engineers and architects who build the pipelines, platforms and processing layers that turn massive datasets into a competitive advantage.",
    overview: [
      "Most organizations are sitting on more data than they can use. Our big data specialists design the architectures and pipelines that make it usable — reliably, at scale.",
      "From Hadoop and Spark to Kafka streams and NoSQL stores, we staff the engineers who move data from raw to ready for analytics and machine learning.",
    ],
    deliver: [
      { t: "Hadoop · Spark · Kafka · NoSQL", d: "Deep expertise across the modern data stack, from distributed storage to stream processing." },
      { t: "Architecture, ETL & pipeline management", d: "End-to-end, from structured to unstructured, batch to stream — built for reliability and observability." },
      { t: "Predictive analytics & ML readiness", d: "Activate massive datasets across industries with feature-ready data and analytics foundations." },
    ],
    chips: ["Hadoop", "Apache Spark", "Apache Kafka", "Cassandra", "MongoDB", "Apache Hive", "Apache Flink", "Elasticsearch", "NoSQL"],
    featureTitle: "From raw data to real-time insight.",
    featureBody: "Structured or unstructured, batch or stream — we build the backbone that makes your data usable.",
    featureImageLabel: "Data pipeline · stream processing",
    seoTitle: "Big Data Engineers & Architects | Technograph",
  },
  {
    slug: "emerging-tech",
    num: "04",
    navLabel: "Emerging Technologies & Innovation",
    navSub: "AI, blockchain, IoT & more",
    footerLabel: "Emerging Technologies",
    indexTitle: "Emerging Technologies & Innovation",
    title: "Emerging Technologies & Innovation",
    tagline: "Future-proof your business.",
    image: "/images/svc-emerging.jpg",
    imageLabel: "Emerging tech lab · prototyping",
    bullets: [
      { t: "AI & Machine Learning", d: "Test, scale, and deploy intelligent systems." },
      { t: "Blockchain & Decentralized Systems", d: "Secure, transparent, distributed architectures." },
      { t: "IoT, Edge, Computer Vision & NLP", d: "Innovation we engineer every day — not just a buzzword." },
    ],
    link: "Explore Emerging Technologies & Innovation →",
    lead: "Specialists who have already shipped at the frontier — AI, blockchain, IoT, edge, computer vision and NLP — embedded in your team.",
    overview: [
      "Emerging technology rewards the teams that move first. We bring practitioners who have taken AI, blockchain and IoT from prototype to production.",
      "Whether you're testing an idea or scaling an intelligent system, our engineers help you separate signal from hype and ship what matters.",
    ],
    deliver: [
      { t: "AI & Machine Learning", d: "Test, scale, and deploy intelligent systems — from LLM applications to production MLOps." },
      { t: "Blockchain & Decentralized Systems", d: "Secure, transparent, distributed architectures and smart contracts." },
      { t: "IoT & Edge", d: "Connected devices and edge computing that bring intelligence into everyday operations." },
      { t: "Computer Vision & NLP", d: "Models that see, read and understand — engineered for real-world accuracy." },
    ],
    chips: ["TensorFlow", "PyTorch", "LangChain", "Solidity", "Edge AI", "OpenCV", "Hugging Face", "MLOps", "Vector DBs"],
    featureTitle: "Innovation we engineer every day.",
    featureBody: "We bring the specialists who have already shipped at the frontier — so you can move first, not last.",
    featureImageLabel: "Innovation lab · prototyping",
    seoTitle: "AI, Blockchain & Emerging Tech Talent | Technograph",
  },
  {
    slug: "digital-transformation",
    num: "05",
    navLabel: "Digital Transformation Consulting",
    navSub: "Modernize, automate & advise",
    footerLabel: "Digital Transformation",
    indexTitle: "Digital Transformation Consulting",
    title: "Digital Transformation Consulting",
    tagline: "Change is complex. We make it actionable.",
    image: "/images/svc-transform.jpg",
    imageLabel: "Transformation roadmap session",
    bullets: [
      { t: "Reimagine legacy systems", d: "Modern tech, modern outcomes." },
      { t: "Automate & improve process efficiency", d: "Digital tools that remove friction." },
      { t: "Bridge business strategy & IT execution", d: "We co-create your roadmap for resilience and growth." },
    ],
    link: "Explore Digital Transformation Consulting →",
    lead: "Consultants who modernize legacy systems, automate processes and bridge business strategy with IT execution.",
    overview: [
      "Transformation fails when strategy and execution live in different rooms. Our consultants sit in both — translating business goals into technical roadmaps that actually ship.",
      "We modernize legacy platforms, automate manual work, and build the internal capabilities your team needs to keep improving after we leave.",
    ],
    deliver: [
      { t: "Reimagine legacy systems", d: "Modern tech, modern outcomes — incremental modernization without business disruption." },
      { t: "Automate & streamline processes", d: "Digital tools that remove friction, from RPA to workflow platforms." },
      { t: "Bridge strategy & IT execution", d: "We co-create your roadmap for resilience and growth." },
      { t: "Build internal capabilities", d: "Coaching, enablement and agile delivery that leave your team stronger." },
    ],
    chips: ["Process Automation", "Cloud Migration", "Change Management", "Agile Delivery", "RPA", "Legacy Modernization", "API Strategy"],
    featureTitle: "A roadmap for resilience and growth.",
    featureBody: "We co-create the plan, deliver the change, and leave your team stronger than we found it.",
    featureImageLabel: "Transformation roadmap · workshop",
    seoTitle: "Digital Transformation Consulting | Technograph",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

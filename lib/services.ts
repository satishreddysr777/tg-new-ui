export type DeliverItem = { n: string; title: string; desc: string };

export type ServiceDetail = {
  slug: string;
  navLabel: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  overviewHeading: string;
  overview: string[];
  deliver: DeliverItem[];
  chips: string[];
  featureHeading: string;
  featureBody: string;
  featureLabel: string;
  metaTitle: string;
  metaDescription: string;
};

export const services: ServiceDetail[] = [
  {
    slug: "cloud",
    navLabel: "Cloud Solutions & Data Analytics",
    shortLabel: "Cloud & Data Analytics",
    eyebrow: "Service 01 · Architect. Scale. Transform.",
    title: "Cloud Solutions & Data Analytics",
    lead: "Whether you’re migrating legacy systems or building cloud-native applications, our certified cloud professionals help you design, deploy, and optimize infrastructure that grows with your business.",
    overviewHeading: "Architect. Scale. Transform.",
    overview: [
      "Whether you’re migrating legacy systems or building cloud-native applications, our certified cloud professionals help you design, deploy, and optimize infrastructure that grows with your business.",
      "From security to cost efficiency, we ensure your cloud investments deliver maximum return — then layer in the data engineering and analytics talent that turns that infrastructure into insight.",
    ],
    deliver: [
      { n: "01", title: "AWS · Azure · Google Cloud", desc: "Certified experts in architecture, security, DevOps, and scalability." },
      { n: "02", title: "Data Engineering & Warehousing", desc: "From ingestion to transformation and visualization, built to last." },
      { n: "03", title: "Real-Time Analytics", desc: "Turn insights into action with low-latency, high-impact dashboards." },
    ],
    chips: ["AWS", "Azure", "Google Cloud", "Terraform", "Kubernetes", "Snowflake", "Databricks", "Apache Airflow", "dbt", "Apache Spark"],
    featureHeading: "Cloud investments that deliver maximum return.",
    featureBody: "We architect for agility and optimize for cost — so every dollar of cloud spend pulls its weight.",
    featureLabel: "Cloud architecture · live dashboard",
    metaTitle: "Cloud Solutions & Data Analytics | Technograph",
    metaDescription: "Certified AWS, Azure & GCP talent who design, deploy, and optimize cloud infrastructure and real-time data pipelines that scale.",
  },
  {
    slug: "aem",
    navLabel: "Adobe Experience Manager",
    shortLabel: "Adobe Experience Manager",
    eyebrow: "Service 02 · Deliver immersive digital experiences at scale.",
    title: "Adobe Experience Manager",
    lead: "Our AEM consultants craft seamless content management ecosystems that unify design, marketing, and user experience — helping enterprises centralize their digital assets and personalize customer journeys.",
    overviewHeading: "Deliver immersive digital experiences at scale.",
    overview: [
      "Our AEM consultants craft seamless content management ecosystems that unify design, marketing, and user experience — helping enterprises centralize their digital assets and personalize customer journeys.",
      "We align technology with strategy to ensure every interaction is seamless, data-informed, and on-brand — all to create the moments that matter.",
    ],
    deliver: [
      { n: "01", title: "Centralize digital assets & campaigns", desc: "One source of truth for every brand touchpoint." },
      { n: "02", title: "Personalize customer journeys", desc: "Tailored experiences across every channel." },
      { n: "03", title: "Integrate with marketing, CRM & eCommerce", desc: "Connected, data-informed interactions end to end." },
    ],
    chips: ["Adobe Experience Manager", "Adobe Target", "Adobe Analytics", "Adobe Campaign", "AEM Assets", "AEM Sites", "AEM Forms", "Headless / SPA"],
    featureHeading: "Every interaction, seamless and on-brand.",
    featureBody: "We unify content, data, and design so your digital experience feels effortless — at any scale.",
    featureLabel: "Personalized digital experience",
    metaTitle: "Adobe Experience Manager | Technograph",
    metaDescription: "AEM consultants who centralize digital assets, personalize journeys, and integrate with your marketing, CRM, and eCommerce stack.",
  },
  {
    slug: "big-data",
    navLabel: "Big Data Solutions",
    shortLabel: "Big Data Solutions",
    eyebrow: "Service 03 · Unlock the power inside your data.",
    title: "Big Data Solutions",
    lead: "We help organizations manage, process, and activate massive datasets across industries — from structured to unstructured, batch to stream.",
    overviewHeading: "Unlock the power inside your data.",
    overview: [
      "We help organizations manage, process, and activate massive datasets across industries — from structured to unstructured, batch to stream.",
      "Our data engineers and analysts build real-time pipelines, scalable architectures, and intuitive dashboards, so you can extract meaning, power smarter decisions, and move at the speed of insight.",
    ],
    deliver: [
      { n: "01", title: "Hadoop · Spark · Kafka · NoSQL", desc: "Deep expertise across the modern data stack." },
      { n: "02", title: "Architecture, ETL & pipeline management", desc: "End-to-end ownership from source to serving layer." },
      { n: "03", title: "Predictive analytics & ML readiness", desc: "Turn raw data into foresight and competitive edge." },
    ],
    chips: ["Hadoop", "Apache Spark", "Apache Kafka", "Cassandra", "MongoDB", "Apache Hive", "Apache Flink", "Elasticsearch", "NoSQL"],
    featureHeading: "From raw data to real-time insight.",
    featureBody: "Structured or unstructured, batch or stream — we build the backbone that makes your data usable.",
    featureLabel: "Data pipeline · stream processing",
    metaTitle: "Big Data Solutions | Technograph",
    metaDescription: "Data engineers across Hadoop, Spark, Kafka, and NoSQL who build real-time pipelines and ML-ready architectures at scale.",
  },
  {
    slug: "emerging-tech",
    navLabel: "Emerging Technologies & Innovation",
    shortLabel: "Emerging Technologies",
    eyebrow: "Service 04 · Future-proof your business.",
    title: "Emerging Technologies & Innovation",
    lead: "We embed forward-thinking engineers and specialists to help you test, scale, and deploy next-generation solutions across the technologies reshaping every industry.",
    overviewHeading: "Future-proof your business.",
    overview: [
      "We embed forward-thinking engineers and specialists to help you test, scale, and deploy next-generation solutions across the technologies reshaping every industry.",
      "Innovation isn’t just a buzzword here — it’s what we engineer every day, with talent that’s already working at the frontier.",
    ],
    deliver: [
      { n: "01", title: "AI & Machine Learning", desc: "From experimentation to production-grade, scaled systems." },
      { n: "02", title: "Blockchain & Decentralized Systems", desc: "Secure, transparent, distributed architectures." },
      { n: "03", title: "IoT & Edge Computing", desc: "Intelligence pushed to where the data is created." },
      { n: "04", title: "Computer Vision & NLP", desc: "Machines that see, read, and understand context." },
    ],
    chips: ["TensorFlow", "PyTorch", "LangChain", "Solidity", "Edge AI", "OpenCV", "Hugging Face", "MLOps", "Vector DBs"],
    featureHeading: "Innovation we engineer every day.",
    featureBody: "We bring the specialists who have already shipped at the frontier — so you can move first, not last.",
    featureLabel: "Innovation lab · prototyping",
    metaTitle: "Emerging Technologies & Innovation | Technograph",
    metaDescription: "Forward-thinking engineers in AI/ML, blockchain, IoT, edge, computer vision, and NLP to help you ship at the frontier.",
  },
  {
    slug: "digital-transformation",
    navLabel: "Digital Transformation Consulting",
    shortLabel: "Digital Transformation",
    eyebrow: "Service 05 · Change is complex. We make it actionable.",
    title: "Digital Transformation Consulting",
    lead: "We partner with your leadership team to reimagine legacy systems with modern tech, improve process efficiency through automation, and bridge the gap between business strategy and IT execution.",
    overviewHeading: "Change is complex. We make it actionable.",
    overview: [
      "We partner with your leadership team to reimagine legacy systems with modern tech, improve process efficiency through automation, and bridge the gap between business strategy and IT execution.",
      "We don’t just consult — we co-create your roadmap for resilience and growth, then help you build the internal capabilities to sustain it.",
    ],
    deliver: [
      { n: "01", title: "Reimagine legacy systems", desc: "Modern architecture, modern outcomes." },
      { n: "02", title: "Automate & streamline processes", desc: "Remove friction with digital tools and RPA." },
      { n: "03", title: "Bridge strategy & IT execution", desc: "A roadmap your business and technology share." },
      { n: "04", title: "Build internal capabilities", desc: "Transformation that sustains long after we leave." },
    ],
    chips: ["Process Automation", "Cloud Migration", "Change Management", "Agile Delivery", "RPA", "Legacy Modernization", "API Strategy"],
    featureHeading: "A roadmap for resilience and growth.",
    featureBody: "We co-create the plan, deliver the change, and leave your team stronger than we found it.",
    featureLabel: "Transformation roadmap · workshop",
    metaTitle: "Digital Transformation Consulting | Technograph",
    metaDescription: "We reimagine legacy systems, automate processes, and bridge business strategy with IT execution — then leave your team stronger.",
  },
];

export const serviceMap: Record<string, ServiceDetail> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);

export function getService(slug: string): ServiceDetail | undefined {
  return serviceMap[slug];
}

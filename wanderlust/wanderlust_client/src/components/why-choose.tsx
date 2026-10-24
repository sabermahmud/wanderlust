import Image from "next/image";

const features = [
  {
    icon: "/assets/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/assets/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/assets/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

function WhyChoose() {
  return (
    <section className="bg-[#e8f6fb] px-6 py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl rounded-lg border border-dashed border-[#a5d3e0] bg-white p-6 sm:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-[#a5d3e0]">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="md:px-7">
              <Image
                src={icon}
                alt=""
                width={28}
                height={28}
                className="size-7"
              />
              <h3 className="mt-4 text-xl font-medium text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { WhyChoose };

import { Container } from "../_components/container";
import Hero from "../_components/hero";

export default async function DegenSquad() {
  return (
    <>
      <Hero
        title="degen squad"
        content={
          <p>
            check out the{" "}
            <a
              rel="noopener noreferer"
              target="_blank"
              href="https://vrchat.com/home/group/grp_d5cab3a0-e22f-45db-9d17-4dfb11daede7"
              className="text-white font-semibold hover:underline"
            >
              degen squad group
            </a>{" "}
            on vrchat.
          </p>
        }
      />
      <Container></Container>
    </>
  );
}

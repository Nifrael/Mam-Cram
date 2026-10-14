import styled from "styled-components";

// Même rendu que le logo texte de l'en-tête du site (Navbar.astro).
// Vollkorn n'est pas encore chargée dans le Studio : repli sur une police à empattements.
const Texte = styled.span`
  font-family: "Vollkorn", Georgia, serif;
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
`;

export function Logo() {
  return <Texte>MAM'CRAM</Texte>;
}

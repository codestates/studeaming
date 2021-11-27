import styled from "styled-components";
import team_logo from "../assets/images/team_logo.svg";

const FooterBox = styled.div`
  padding: 3rem 3rem;
  background-color: var(--color-main-25);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const LogoBox = styled.div`
  flex: 1 0 auto;

  span {
    font-size: 0.8rem;
    color: var(--color-black-25);
    padding: 1rem 1.6rem;
  }
`;
const TeamLogo = styled.img`
  display: block;
  width: 200px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;

  :first-of-type {
    margin-right: 4rem;
  }
  /* justify-content: center; */
`;

const Menu = styled.div`
  padding: 1rem 2rem;
  color: var(--color-black);
  font-weight: 500;
  font-size: 1.4rem;
  @media screen and (max-width: 768px) {
    display: block;
    padding: 1rem 1.6rem;
    margin-top: 1.4rem;
  }
`;

const Element = styled.a`
  display: inline-block;
  letter-spacing: 0.1em;
  padding: 1rem 2rem;
  color: var(--color-charcoal);

  .emoticon {
    visibility: hidden;
  }

  :hover {
    font-weight: 600;

    .emoticon {
      visibility: visible;
    }
  }
  @media screen and (max-width: 768px) {
    display: block;
    padding: 0.8rem 1.6rem;
  }
`;

function Footer() {
  const members = [
    { name: "안민수", github: "https://github.com/Deb-neal" },
    { name: "황교식", github: "https://github.com/Gyosic" },
    { name: "나수민", github: "https://github.com/soominna" },
    { name: "문예인", github: "https://github.com/yeinMOON" },
  ];
  return (
    <FooterBox>
      <LogoBox>
        <TeamLogo src={team_logo} />
        <span>© 2021 studeaming. All rights reserved.</span>
      </LogoBox>
      <Nav>
        <Menu>about</Menu>
        <Element
          href="https://github.com/codestates/studeaming"
          target="_blank"
        >
          레포지토리
          <span className="emoticon"> 📒</span>
        </Element>
        <Element
          href="https://github.com/codestates/studeaming/wiki"
          target="_blank"
        >
          위키
          <span className="emoticon"> 🔍</span>
        </Element>
      </Nav>
      <Nav>
        <Menu>member</Menu>
        {members.map((member) => {
          return (
            <Element href={member.github} target="_blank">
              {member.name}
              <span className="emoticon"> 👋🏼 </span>
            </Element>
          );
        })}
      </Nav>
    </FooterBox>
  );
}

export default Footer;

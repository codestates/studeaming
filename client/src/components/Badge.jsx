import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  gap: 0.8rem;
  border-radius: 10px;
  /* background-color: var(--color-main-50); */
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: flex-start;
    height: fit-content;
    gap: 2px;
    width: fit-content;
  }
`;

const BadgeBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isGet ? `var(--color-${props.color})` : "var(--color-gray-bg)"};
  border-radius: 30%;
  font-size: 1.4rem;

  .not_achieved {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(141, 141, 141, 0.6);
    border-radius: 30%;
  }

  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

function Badge({ badges }) {
  return (
    <Container>
      {badges.map((badge, idx) => {
        const { name, isGet, emoticon, color, description } = badge;
        return (
          <BadgeBox key={idx} color={color} isGet={isGet}>
            {isGet ? null : <div className="not_achieved"></div>}
            {emoticon}
          </BadgeBox>
        );
      })}
    </Container>
  );
}

export default Badge;

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
    justify-content: space-between;
    height: fit-content;
    margin-top: 10px;
  }
`;

const BadgeBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.getOrNot ? `var(--color-${props.color})` : "var(--color-gray-bg)"};
  border-radius: 30%;
  /* border: ${(props) =>
    props.getOrNot ? "none" : "1px dashed var(--color-black-25)"}; */
  font-size: 1.4rem;

  .not_achieved {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(141, 141, 141, 0.6);
    border-radius: 30%;

    @media screen and (max-width: 768px) {
      /* border-radius: 50%; */
    }
  }

  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
    height: 25px;
    width: 25px;
    /* border-radius: 50%; */
  }
`;

function Badge({ badges }) {
  return (
    <Container>
      {badges.map((badge) => {
        const { name, getOrNot, emoticon, color, desc } = badge;
        return (
          <BadgeBox color={color} getOrNot={getOrNot}>
            {getOrNot ? null : <div className="not_achieved"></div>}
            {emoticon}
          </BadgeBox>
        );
      })}
    </Container>
  );
}

export default Badge;

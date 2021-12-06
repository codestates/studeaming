import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  gap: 0.8rem;
  border-radius: 10px;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);

  /* @media screen and (max-width: 768px) {
    display: flex;
    justify-content: flex-start;
    width: fit-content;
    height: fit-content;
    gap: 2px;
  } */
`;

const BadgeBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isGet ? `var(--color-${props.color})` : "var(--color-gray-bg)"};
  border-radius: 30%;

  .bubble {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    width: 150px;
    padding: 0.6rem 0.8rem;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;
    margin-bottom: 10px;
    visibility: hidden;
    border-radius: 10px;
    background-color: var(--color-main-25);
    z-index: 100;

    .name {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-main-100);
      word-break: normal;
    }

    .description {
      display: inline-block;
      font-size: 0.8rem;
      color: var(--color-black-50);
      margin-top: 3px;
    }

    ::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 35%;
      margin-left: -8px;
      border-width: 8px;
      border-style: solid;
      border-color: var(--color-main-25) transparent transparent transparent;
    }
  }
  .bubble-only-title {
    width: fit-content;
  }

  :hover {
    .bubble {
      visibility: visible;
    }
  }

  .not_achieved {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(141, 141, 141, 0.6);
    border-radius: 30%;
  }

  .emoticon {
    font-size: 22px;
  }

  /* @media screen and (max-width: 768px) {
    width: 30px;
    height: 30px;
  } */
`;

function Badge({ badges, isOthersProfile }) {
  return (
    <Container>
      {badges.map((badge, idx) => {
        const { name, isGet, emoticon, color, description } = badge;
        return (
          <BadgeBox key={idx} color={color} isGet={isGet}>
            {isGet ? null : <div className="not_achieved"></div>}
            <div className={`bubble ${isOthersProfile && "bubble-only-title"}`}>
              <span className="name">{name}</span>
              {!isOthersProfile && (
                <span className="description">{description}</span>
              )}
            </div>
            <span className="emoticon">{emoticon}</span>
          </BadgeBox>
        );
      })}
    </Container>
  );
}

export default Badge;

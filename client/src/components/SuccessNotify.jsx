import styled from "styled-components";
import { BsCheckCircle } from "react-icons/bs";

export const StyledCheck = styled(BsCheckCircle)`
  color: var(--color-main-100);
  margin-bottom: 5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .success_message {
    margin: 0.8rem 0;
  }

  .success_description {
    color: var(--color-black-50);
    font-size: 0.8rem;
    text-align: center;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

function SuccessNotify({ message, description }) {
  return (
    <Container>
      <StyledCheck size="30px" />
      <div className="success_message">{message}</div>
      {description.length ? (
        <div className="success_description">{description}</div>
      ) : null}
    </Container>
  );
}

export default SuccessNotify;

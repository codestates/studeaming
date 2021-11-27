import { useState } from "react";
import styled from "styled-components";

const LogChartSection = styled.section`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;

  > .ten_minute {
    display: flex;
    align-items: center;
    width: 100%;
    height: 20px;

    > .ten_minute_block {
      width: 100%;
      text-align: center;
    }
  }

  > .hour_block_wrapper {
    display: flex;

    > .hour {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 35.71px;
      height: 480px;

      > .hour_block {
        width: 35.71px;
        height: 20px;
        text-align: center;
        border-right: 1px solid;
        padding-top: 5px;
      }
    }
  }
`;

const Chart = styled.section`
  width: 100%;
  height: 480px;
  display: grid;
  place-items: center;
  grid-template-rows: repeat(24, 1fr);
  grid-template-columns: repeat(6, 1fr);

  > .one_block {
    width: 100%;
    height: 20px;
    border-right: 1px solid;
    :nth-child(6n) {
      border-right: none;
    }

    > .log {
      margin-top: 5px;
      height: 10px;
      width: 50%;
      background-color: lightgrey;
    }
  }
`;

function LogChart() {
  const [block, setBlock] = useState(Array(144).fill(""));
  const minute = ["", 10, 20, 30, 40, 50, 60];
  const hour = new Array(24).fill(0).map((_, idx) => idx);

  return (
    <LogChartSection>
      <div className="ten_minute">
        {minute.map((el, idx) => (
          <div key={idx} className="ten_minute_block">
            {el}
          </div>
        ))}
      </div>
      <div className="hour_block_wrapper">
        <div className="hour">
          {hour.map((el, idx) => (
            <div className="hour_block" key={idx}>
              {el}
            </div>
          ))}
        </div>
        <Chart>
          {block.map((el, idx) => (
            <div className="one_block" key={idx}>
              <div className="log" />
            </div>
          ))}
        </Chart>
      </div>
    </LogChartSection>
  );
}

export default LogChart;

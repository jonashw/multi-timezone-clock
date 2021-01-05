import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Stage, Layer, Arc, Text, Circle, Group, Line } from "react-konva";
import "/src/style.css";

let timezones = [
  { name: "Sydney", offset: 11 },
  { name: "India", offset: 5.5 },
  { name: "California", offset: -8 }
];

let initialState = {
  fixedHand: true,
  warp: false,
  date: new Date()
};

class CenteredText extends React.Component {
  offsetX = 0;
  offsetY = 0;
  componentDidMount() {
    this.offsetX = this.ref.textWidth / 2;
    this.offsetY = this.ref.textHeight / 2;
  }
  render() {
    return (
      <Text
        {...this.props}
        ref={(r) => (this.ref = r)}
        offsetX={this.offsetX}
        offsetY={this.offsetY}
      />
    );
  }
}
const App = () => {
  const [state, setState] = useState(initialState);
  const timeZoneNameOnHand = !state.fixedHand;
  const timeZoneNameOnWorkday = !timeZoneNameOnHand;
  let s = Math.min(window.innerHeight, window.innerWidth) / 12;

  useEffect(() => {
    const intervalId = setInterval(() => {
      let d = state.date;
      let date = !!state.warp
        ? new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes() + 1,
            d.getSeconds()
          )
        : new Date();
      //assign interval to a variaable to clear it
      setState({ ...state, date });
    }, 1000);

    return () => clearInterval(intervalId); //This is important
  }, [state]);

  let d = state.date;
  let t =
    (360 *
      (d.getUTCSeconds() / 3600 + d.getUTCMinutes() / 60 + d.getUTCHours())) /
    24;

  timezones = timezones.map((tz, i) => {
    tz.theta = -(tz.offset / 24) * 360;
    tz.theta = tz.theta + (state.fixedHand ? -t : 0);
    tz.r = s * (i + 3);
    return tz;
  });
  let center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  let imgIds = [
    10,
    1002,
    1016,
    1019,
    1022,
    1032,
    1038,
    1041,
    1042,
    1063,
    1069,
    1074,
    1080
  ];
  let randomImgId = imgIds[9]; //imgIds[Math.floor(Math.random() * imgIds.length)];
  return (
    <div
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
        position: "relative",
        fontFamily: "Roboto"
      }}
      onChange={(e) => setState({ ...state, fixedHand: !state.fixedHand })}
    >
      <div
        className="background-image"
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundImage: `url(https://picsum.photos/id/${randomImgId}/${iw}/${ih}?blur=10)`,
          backgroundSize: "cover"
        }}
      />
      {/*
      <div style={{ position: "absolute", zIndex: 2 }}>
        <label>
          <input
            type="checkbox"
            checked={state.fixedHand}
            onChange={(e) =>
              setState({ ...state, fixedHand: !state.fixedHand })
            }
          />
          Fixed Hand
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={state.warp}
            onChange={(e) => setState({ ...state, warp: !state.warp })}
          />
          High-speed simulation
        </label>
      </div>
      */}
      <Stage
        className="content"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ zIndex: 1 }}
        onClick={() => setState({ ...state, fixedHand: !state.fixedHand })}
      >
        <Layer>
          {timezones.map((tz, tzi) => {
            return (
              <Group x={center.x} y={center.y} key={tzi}>
                <Group rotation={tz.theta}>
                  <Arc
                    innerRadius={tz.r - s / 2}
                    outerRadius={tz.r + s / 2}
                    angle={(8 / 24) * 360}
                    rotation={360 * (3 / 24)}
                    fill="rgba(0,0,0,0.5)"
                  />
                  {timeZoneNameOnWorkday && (
                    <Group offstY={tz.r} rotation={360 * (12.5 / 24)}>
                      <CenteredText
                        text={tz.name}
                        stroke={"rgba(0,0,0,0.5)"}
                        strokeWidth={3}
                        fontFamily="Roboto"
                        fontSize={16}
                        fillAfterStrokeEnabled={true}
                        fill={"white"}
                        y={-(tz.r + 15)}
                      />
                    </Group>
                  )}

                  {Array(24)
                    .fill(0)
                    .map((_, i) => (360 / 24) * i)
                    .map((r, i) => (
                      <Group rotation={r} key={i}>
                        <Group x={0} y={-tz.r}>
                          <Line
                            points={[0, s / 2, 0, s / 2.5]}
                            stroke="white"
                            strokeWidth={1}
                          />
                          <CenteredText
                            text={i}
                            fill="white"
                            fontSize={14}
                            fontFamily={"Roboto,Arial"}
                            y={s / 5}
                            rotation={-(r + tz.theta)}
                          />
                        </Group>
                      </Group>
                    ))}
                </Group>
              </Group>
            );
          })}
        </Layer>
        <Layer>
          <Group x={center.x} y={center.y} rotation={state.fixedHand ? 0 : t}>
            <Line
              points={[0, 0, 0, -s * (timezones.length + 2.5) - 5]}
              stroke="white"
              lineCap="round"
              strokeWidth={2}
            />
            <Circle
              radius={5}
              fill="transparent"
              stroke="white"
              strokeWidth={1}
            />
            {timezones.map((tz, tzi) => (
              <Group key={tzi}>
                {timeZoneNameOnHand && (
                  <CenteredText
                    text={tz.name}
                    stroke={"rgba(0,0,0,0.5)"}
                    strokeWidth={3}
                    fontFamily="Roboto"
                    fontSize={16}
                    fillAfterStrokeEnabled={true}
                    fill={"white"}
                    y={-(tz.r + 15)}
                  />
                )}

                <Circle
                  x={0}
                  y={0}
                  radius={tz.r + s / 2}
                  stroke={"white"}
                  strokeWidth={2}
                  fill={"rgba(0,0,0,0.0)"}
                />
              </Group>
            ))}
            <Circle
              x={0}
              y={0}
              radius={2.5 * s}
              stroke={"white"}
              strokeWidth={2}
              fill={"rgba(0,0,0,0.0)"}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

render(<App />, document.getElementById("root"));

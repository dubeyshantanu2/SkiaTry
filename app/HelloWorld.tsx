import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Canvas,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Mask,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Group,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Rect,
  Path,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useValue,
  useSharedValueEffect,
} from '@shopify/react-native-skia';
import { interpolatePath } from 'd3-interpolate-path';
import React, { useState, useMemo, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSharedValue, withTiming, withRepeat } from 'react-native-reanimated';

const CIRCLE_RADIUS = 40;

export const HelloWorld = () => {
  const [circlePostion, setCirclePosition] = useState({ x: 0, y: 0 });
  const [buttonPostion, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const circlePath = useMemo(
    () =>
      `M ${circlePostion.x + CIRCLE_RADIUS / 2}, ${
        circlePostion.y + CIRCLE_RADIUS / 2
      } m -${CIRCLE_RADIUS}, 0 a ${CIRCLE_RADIUS},${CIRCLE_RADIUS} 0 1,0 ${
        CIRCLE_RADIUS * 2
      },0 a ${CIRCLE_RADIUS},${CIRCLE_RADIUS} 0 1,0 ${-CIRCLE_RADIUS * 2},0`,
    [circlePostion.x, circlePostion.y]
  );

  const rectPath = useMemo(
    () =>
      `m ${buttonPostion.x - 5} ${buttonPostion.y - 5} h ${buttonPostion.width + 10} v ${
        buttonPostion.height + 10
      } h ${-buttonPostion.width - 10} 0 z`,
    [buttonPostion.height, buttonPostion.width, buttonPostion.x, buttonPostion.y]
  );

  const progress = useSharedValue(0);
  const path = useValue(circlePath);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, [progress]);
  useSharedValueEffect(() => {
    path.current =
      progress.value === 0 ? circlePath : interpolatePath(circlePath, rectPath)(progress.value);
  }, progress);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Ionicons
          name="menu-outline"
          size={40}
          color="#000"
          style={{ marginTop: 115, marginLeft: '8%' }}
          onLayout={({
            nativeEvent: {
              layout: { x, y },
            },
          }) => setCirclePosition({ x, y })}
        />
        <TouchableOpacity
          style={{
            marginTop: 600,
            padding: 10,
            margin: 10,
            borderColor: 'blue',
            borderWidth: 2,
            width: 200,
            marginLeft: '25%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => setButtonPosition({ x, y, width, height })}>
          <Text>Press Me</Text>
        </TouchableOpacity>
      </View>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Canvas style={{ flex: 1 }}>
          {/* <Mask
            mode="luminance"
            mask={
              <Group>
                <Rect x={0} y={0} width={width} height={height} color="white" />
                <Path path={circlePath} color="black" />
                <Path path={rectPath} color="black" />
              </Group>
            }>
            <Rect x={0} y={0} width={width} height={height} color="rgba(0,0,0,0.8)" />
          </Mask> */}
          <Path path={path} color="yellow" />
        </Canvas>
      </View>
    </View>
  );
};

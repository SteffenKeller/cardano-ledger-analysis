"use client";

import {useEffect, useRef, useState} from "react";
import ReactEcharts from "echarts-for-react";

export default function Chart({data}) {

    const data2 = {
        "name": "flare",
        "label": {
            "show": true,
        },
        "children": [
            {
                "name": "analytics",
                "children": [
                    {
                        "name": "cluster",
                        "children": [
                            {"name": "AgglomerativeCluster", "value": 3938},
                            {"name": "CommunityStructure", "value": 3812},
                            {"name": "HierarchicalCluster", "value": 6714},
                            {"name": "MergeEdge", "value": 743}
                        ]
                    },
                    {
                        "name": "graph",
                        "children": [
                            {"name": "BetweennessCentrality", "value": 3534},
                            {"name": "LinkDistance", "value": 5731},
                            {"name": "MaxFlowMinCut", "value": 7840},
                            {"name": "ShortestPaths", "value": 5914},
                            {"name": "SpanningTree", "value": 3416}
                        ]
                    },
                    {
                        "name": "optimization",
                        "children": [
                            {"name": "AspectRatioBanker", "value": 7074}
                        ]
                    }
                ]
            },
            {
                "name": "animate",
                "children": [
                    {"name": "Easing", "value": 17010},
                    {"name": "FunctionSequence", "value": 5842},
                    {
                        "name": "interpolate",
                        "children": [
                            {"name": "ArrayInterpolator", "value": 1983},
                            {"name": "ColorInterpolator", "value": 2047},
                            {"name": "DateInterpolator", "value": 1375},
                            {"name": "Interpolator", "value": 8746},
                            {"name": "MatrixInterpolator", "value": 2202},
                            {"name": "NumberInterpolator", "value": 1382},
                            {"name": "ObjectInterpolator", "value": 1629},
                            {"name": "PointInterpolator", "value": 1675},
                            {"name": "RectangleInterpolator", "value": 2042}
                        ]
                    },
                    {"name": "ISchedulable", "value": 1041},
                    {"name": "Parallel", "value": 5176},
                    {"name": "Pause", "value": 449},
                    {"name": "Scheduler", "value": 5593},
                    {"name": "Sequence", "value": 5534},
                    {"name": "Transition", "value": 9201},
                    {"name": "Transitioner", "value": 19975},
                    {"name": "TransitionEvent", "value": 1116},
                    {"name": "Tween", "value": 6006}
                ]
            },
            {
                "name": "data",
                "children": [
                    {
                        "name": "converters",
                        "children": [
                            {"name": "Converters", "value": 721},
                            {"name": "DelimitedTextConverter", "value": 4294},
                            {"name": "GraphMLConverter", "value": 9800},
                            {"name": "IDataConverter", "value": 1314},
                            {"name": "JSONConverter", "value": 2220}
                        ]
                    },
                    {"name": "DataField", "value": 1759},
                    {"name": "DataSchema", "value": 2165},
                    {"name": "DataSet", "value": 586},
                    {"name": "DataSource", "value": 3331},
                    {"name": "DataTable", "value": 772},
                    {"name": "DataUtil", "value": 3322}
                ]
            },
        ]
    }

    const option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'tree',
                data: [data],
                top: '1%',
                left: '15%',
                bottom: '1%',
                right: '7%',
                symbolSize: 7,
                orient: 'RL',
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                },
                leaves: {
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    }
                },
                emphasis: {
                    focus: 'descendant'
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    };



    return (
        <div className="bg-white p-6 mt-4 rounded-xl shadow-lg w-full">
            <div className="">
                <h2 className="text-xl mb-4">Backtrace Inputs</h2>
                <div id="chart">
                    <ReactEcharts option={option} />
                </div>
            </div>
        </div>

    )
}
import * as core from '@actions/core';
import { validateVariables} from "unity-ci-self-hosted-common";
import { getUnityPath } from "unity-ci-self-hosted-common";
import { VariableValue } from "unity-ci-self-hosted-common";

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE: <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },
    UNITY_PATH: <Value>{ 
        value: process.env.UNITY_PATH, 
        mandatory: false, 
        default: getUnityPath('windows', core.getInput('unityVersion'))
    },

    // Github action inputs
    unityVersion:          <Value>{ value: core.getInput('unityVersion'),             mandatory: true                                                 },
    unityProjectPath:      <Value>{ value: core.getInput('unityProjectPath'),         mandatory: false,   default: process.env.GITHUB_WORKSPACE       },
    unityArtifactsPath:    <Value>{ value: core.getInput('unityArtifactsPath'),       mandatory: false,   default: 'artifacts'                        },
    unityTestMode:         <Value>{ value: core.getInput('unityTestMode'),            mandatory: true                                                 },
    unityCustomArguments:  <Value>{ value: core.getInput('unityCustomArguments'),     mandatory: false,   default: ''                                 },
};

validateVariables(variables);

if (["playmode", "editmode", "all"].includes(variables.unityTestMode.value.toLowerCase()) === false) {
    throw new Error(`Invalid unityTestMode: ${variables.unityTestMode.value}`);
}

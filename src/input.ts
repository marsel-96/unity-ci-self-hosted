import * as core from '@actions/core';
import { validateVariables} from "unity-ci-self-hosted-common";
import { getUnityPath } from "unity-ci-self-hosted-common";
import { VariableValue } from "unity-ci-self-hosted-common";
import { getUnityPathOrDefault, getUnityPathFromProject } from 'unity-ci-self-hosted-common/dist';

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE: <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },
    UNITY_PATH: <Value>{ 
        value: process.env.UNITY_PATH, 
        mandatory: false,
    },

    // Github action inputs
    unityVersion:          <Value>{ value: core.getInput('unityVersion'),             mandatory: true                           },
    unityTestMode:         <Value>{ value: core.getInput('unityTestMode'),            mandatory: true                           },

    unityCustomArguments:  <Value>{ value: core.getInput('unityCustomArguments'),     mandatory: false,   default: ''           },
    unityProjectPath:      <Value>{ value: core.getInput('unityProjectPath'),         mandatory: false,   default: ''           },
    unityArtifactsPath:    <Value>{ value: core.getInput('unityArtifactsPath'),       mandatory: false,   default: 'artifacts'  },
};

validateVariables(variables);

if (["playmode", "editmode", "all"].includes(variables.unityTestMode.value.toLowerCase()) === false) {
    throw new Error(`Invalid unityTestMode: ${variables.unityTestMode.value}`);
}

variables.unityProjectPath.value = getUnityPathOrDefault(variables.unityProjectPath.value, variables.GITHUB_WORKSPACE.value);
variables.unityArtifactsPath.value = getUnityPathOrDefault(variables.unityArtifactsPath.value, variables.unityProjectPath.value);

variables.UNITY_PATH.value = variables.UNITY_PATH.value ?? getUnityPathFromProject("windows", variables.unityProjectPath.value);

import { StateGraph, END, MemorySaver } from '@langchain/langgraph';
import { EmotionGraphState } from './state';
import { parseBodyNode } from './nodes/parseBody';
import { mapEmotionNode } from './nodes/mapEmotion';
import { updateDictionaryNode } from './nodes/updateDictionary';
import { suggestCopingNode } from './nodes/suggestCoping';
import { generateCardNode } from './nodes/generateCard';

/**
 * Route after parseBody node.
 * If crisis is detected, go to END immediately.
 * Otherwise, continue to mapEmotion.
 */
function routeFromStart(
  state: typeof EmotionGraphState.State
): 'selection' | 'checkin' {
  if (state.selectedEmotion) return 'selection';
  return 'checkin';
}

function routeAfterParsing(
  state: typeof EmotionGraphState.State
): 'crisis' | 'mapping' {
  if (state.crisisDetected) return 'crisis';
  return 'mapping';
}

// Build the emotion processing graph
const workflow = new StateGraph(EmotionGraphState)
  // Add all nodes
  .addNode('parseBody', parseBodyNode)
  .addNode('mapEmotion', mapEmotionNode)
  .addNode('updateDictionary', updateDictionaryNode)
  .addNode('suggestCoping', suggestCopingNode)
  .addNode('generateCard', generateCardNode)

  // Conditional entry: Check-in flow (body data) vs Selection flow (selected emotion)
  .addConditionalEdges('__start__', routeFromStart, {
    checkin: 'parseBody',
    selection: 'updateDictionary',
  })
  .addConditionalEdges('parseBody', routeAfterParsing, {
    crisis: END,
    mapping: 'mapEmotion',
  })
  .addEdge('mapEmotion', END)

  // Phase 2: After user selects emotion -> dictionary -> coping -> card
  .addEdge('updateDictionary', 'suggestCoping')
  .addEdge('suggestCoping', 'generateCard')
  .addEdge('generateCard', END);

// Use in-memory checkpointer for human-in-the-loop
const checkpointer = new MemorySaver();

export const emotionGraph = workflow.compile({ checkpointer });

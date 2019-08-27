import { Container } from 'inversify';
import { PipelineImpl } from './implementations/Pipeline';
import { Pipeline } from './interfaces/Pipeline';

const PipelineSymbol = Symbol.for('ContainerPipeline');

export function BindPipelineFactory(container: Container): symbol {
    container.bind(PipelineImpl).toSelf();
    container.bind(PipelineSymbol).toAutoFactory<Pipeline>(PipelineImpl);
    return PipelineSymbol;
}
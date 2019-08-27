import 'reflect-metadata';
import { BindPipelineFactory } from '../src/index';
import { Container, interfaces } from 'inversify';
import { Pipeline } from '../src/interfaces/Pipeline';
import { PipelineImpl } from '../src/implementations/Pipeline';

test('Bind', () => {
    const container = new Container();
    const factorySymbol = BindPipelineFactory(container);
    expect(container.isBound(factorySymbol));
    const factory = container.get<interfaces.Factory<Pipeline>>(factorySymbol);
    expect(factory).toBeDefined();
    expect(typeof factory).toBe('function');

    const pipeline = factory();
    expect(pipeline).toBeDefined();
    expect(pipeline).toBeInstanceOf(PipelineImpl);
    
})
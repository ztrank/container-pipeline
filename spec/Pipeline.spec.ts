import 'reflect-metadata';
import { PipelineImpl } from '../src/implementations/Pipeline';
import { of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Container } from 'inversify';

test('Execute in order', (done) => {
    const pipe1 = {
        pipe: jest.fn()
    };
    const pipe2 = {
        pipe: jest.fn()
    };
    const pipe3 = {
        pipe: jest.fn()
    };

    pipe1.pipe.mockImplementation(container => {
        expect(container).toBeDefined();
        expect(pipe2.pipe).toHaveBeenCalledTimes(0);
        expect(pipe3.pipe).toHaveBeenCalledTimes(0);
        return timer(200)
            .pipe(mergeMap(() => of(container)));
    });

    pipe2.pipe.mockImplementation(container => {
        expect(container).toBeDefined();
        expect(pipe1.pipe).toHaveBeenCalledTimes(1);
        expect(pipe3.pipe).toHaveBeenCalledTimes(0);
        return timer(200)
            .pipe(mergeMap(() => of(container)));
    });

    pipe3.pipe.mockImplementation(container => {
        expect(container).toBeDefined();
        expect(pipe1.pipe).toHaveBeenCalledTimes(1);
        expect(pipe3.pipe).toHaveBeenCalledTimes(1);
        return timer(200)
            .pipe(mergeMap(() => of(container)));
    });

    const pipeline = new PipelineImpl();
    const container = new Container();
    container.bind('pipe1').toConstantValue(pipe1);
    container.bind('pipe2').toConstantValue(pipe2);
    container.bind('pipe3').toConstantValue(pipe3);
    pipeline.add('pipe1');
    pipeline.add('pipe2');
    pipeline.add('pipe3');

    pipeline.execute(container)
        .subscribe(container => {
            expect(container).toBeDefined();
            expect(pipe1.pipe).toHaveBeenCalledTimes(1);
            expect(pipe2.pipe).toHaveBeenCalledTimes(1);
            expect(pipe3.pipe).toHaveBeenCalledTimes(1);
            done();
        });
})
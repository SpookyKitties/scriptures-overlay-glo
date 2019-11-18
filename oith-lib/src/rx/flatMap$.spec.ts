import { flatMap, takeLast, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { flatMap$ } from './flatMap$';

describe('Flatmap', async () => {
  it('Promises', async () => {
    expect(
      await of(of('test').toPromise())
        .pipe(flatMap$)
        .toPromise(),
    ).toEqual('test');
  });
  it('Observables', async () => {
    expect(
      await of(of('test'))
        .pipe(flatMap$)
        .toPromise(),
    ).toEqual('test');
  });

  it('Arrays', async () => {
    expect(
      await of([1, 2, 3])
        .pipe(
          flatMap$,
          take(1),
        )
        .toPromise(),
    ).toBe(1);
  });
});

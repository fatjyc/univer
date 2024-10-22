/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IDocumentBody } from '../../../../types/interfaces';
import type { TextXAction } from '../action-types';
import { describe, expect, it } from 'vitest';
import { BooleanNumber } from '../../../../types/enum';
import { TextXActionType } from '../action-types';
import { TextX } from '../text-x';

function getDefaultDoc() {
    const doc: IDocumentBody = {
        dataStream: 'w\r\n',
        textRuns: [
            {
                st: 0,
                ed: 1,
                ts: {
                    bl: BooleanNumber.TRUE,
                },
            },
        ],
    };

    return doc;
}

function getDefaultDocWithLength2() {
    const doc: IDocumentBody = {
        dataStream: 'ww\r\n',
        textRuns: [
            {
                st: 0,
                ed: 2,
                ts: {
                    bl: BooleanNumber.TRUE,
                },
            },
        ],
    };

    return doc;
}

describe('apply method', () => {
    it('should get the same result when apply two actions by order OR composed first case 1', () => {
        const actionsA: TextXAction[] = [
            {
                t: TextXActionType.INSERT,
                len: 1,
                line: 0,
                body: {
                    dataStream: 'h',
                },
            },
        ];
        const actionsB: TextXAction[] = [
            {
                t: TextXActionType.RETAIN,
                len: 1,
                body: {
                    dataStream: '',
                    textRuns: [
                        {
                            st: 0,
                            ed: 1,
                            ts: {
                                bl: BooleanNumber.FALSE,
                            },
                        },
                    ],
                },
                segmentId: '',
            },
        ];

        const doc1 = getDefaultDoc();
        const doc2 = getDefaultDoc();
        const doc3 = getDefaultDoc();
        const doc4 = getDefaultDoc();

        const resultA = TextX.apply(TextX.apply(doc1, actionsA), TextX.transform(actionsB, actionsA, 'left'));
        const resultB = TextX.apply(TextX.apply(doc2, actionsB), TextX.transform(actionsA, actionsB, 'right'));

        const composedAction1 = TextX.compose(actionsA, TextX.transform(actionsB, actionsA, 'left'));
        const composedAction2 = TextX.compose(actionsB, TextX.transform(actionsA, actionsB, 'right'));

        const resultC = TextX.apply(doc3, composedAction1);
        const resultD = TextX.apply(doc4, composedAction2);

        expect(resultA).toEqual(resultB);
        expect(resultC).toEqual(resultD);
        expect(resultA).toEqual(resultC);
        expect(composedAction1).toEqual(composedAction2);
    });

    // https://github.com/dream-num/univer-pro/issues/2943
    it('should get the same result when apply two actions by order OR composed first case 2', () => {
        const actionsA: TextXAction[] = [
            {
                t: TextXActionType.RETAIN,
                segmentId: '',
                len: 1,
            },
            {
                t: TextXActionType.INSERT,
                len: 1,
                line: 0,
                body: {
                    dataStream: 'h',
                    textRuns: [
                        {
                            st: 0,
                            ed: 1,
                            ts: {
                                bl: BooleanNumber.TRUE,
                            },
                        },
                    ],
                },
            },
        ];
        const actionsB: TextXAction[] = [
            {
                t: TextXActionType.RETAIN,
                len: 1,
                body: {
                    dataStream: '',
                    textRuns: [
                        {
                            st: 0,
                            ed: 1,
                            ts: {
                                bl: BooleanNumber.FALSE,
                            },
                        },
                    ],
                },
                segmentId: '',
            },
        ];

        const doc1 = getDefaultDoc();
        const doc2 = getDefaultDoc();
        const doc3 = getDefaultDoc();
        const doc4 = getDefaultDoc();

        const resultA = TextX.apply(TextX.apply(doc1, actionsA), TextX.transform(actionsB, actionsA, 'left'));
        const resultB = TextX.apply(TextX.apply(doc2, actionsB), TextX.transform(actionsA, actionsB, 'right'));

        const composedAction1 = TextX.compose(actionsA, TextX.transform(actionsB, actionsA, 'left'));
        const composedAction2 = TextX.compose(actionsB, TextX.transform(actionsA, actionsB, 'right'));

        const resultC = TextX.apply(doc3, composedAction1);
        const resultD = TextX.apply(doc4, composedAction2);

        // console.log(JSON.stringify(resultA, null, 2));
        // console.log(JSON.stringify(resultB, null, 2));

        // console.log(JSON.stringify(composedAction2, null, 2));
        // console.log(JSON.stringify(resultC, null, 2));

        expect(resultA).toEqual(resultB);
        expect(resultC).toEqual(resultD);
        expect(resultA).toEqual(resultC);
        expect(composedAction1).toEqual(composedAction2);
    });

    it('should get the same result when apply two actions by order OR composed first case 3', () => {
        const actionsA: TextXAction[] = [
            {
                t: TextXActionType.RETAIN,
                segmentId: '',
                len: 1,
            },
            {
                t: TextXActionType.INSERT,
                len: 1,
                line: 0,
                body: {
                    dataStream: 'h',
                    textRuns: [
                        {
                            st: 0,
                            ed: 1,
                            ts: {
                                bl: BooleanNumber.TRUE,
                            },
                        },
                    ],
                },
            },
        ];
        const actionsB: TextXAction[] = [
            {
                t: TextXActionType.RETAIN,
                len: 2,
                body: {
                    dataStream: '',
                    textRuns: [
                        {
                            st: 0,
                            ed: 2,
                            ts: {
                                bl: BooleanNumber.FALSE,
                            },
                        },
                    ],
                },
                segmentId: '',
            },
        ];

        const doc1 = getDefaultDocWithLength2();
        const doc2 = getDefaultDocWithLength2();
        const doc3 = getDefaultDocWithLength2();
        const doc4 = getDefaultDocWithLength2();

        const resultA = TextX.apply(TextX.apply(doc1, actionsA), TextX.transform(actionsB, actionsA, 'left'));
        const resultB = TextX.apply(TextX.apply(doc2, actionsB), TextX.transform(actionsA, actionsB, 'right'));

        const composedAction1 = TextX.compose(actionsA, TextX.transform(actionsB, actionsA, 'left'));
        const composedAction2 = TextX.compose(actionsB, TextX.transform(actionsA, actionsB, 'right'));

        const resultC = TextX.apply(doc3, composedAction1);
        const resultD = TextX.apply(doc4, composedAction2);

        // console.log(JSON.stringify(resultA, null, 2));
        // console.log(JSON.stringify(resultB, null, 2));

        // console.log('composedAction1', JSON.stringify(composedAction1, null, 2));

        // console.log(JSON.stringify(resultC, null, 2));

        expect(resultA).toEqual(resultB);
        expect(resultC).toEqual(resultD);
        expect(resultA).toEqual(resultC);
        expect(composedAction1).toEqual(composedAction2);
    });
});
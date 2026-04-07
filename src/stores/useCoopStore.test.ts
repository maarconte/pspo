import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCoopStore } from './useCoopStore';

describe('useCoopStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useCoopStore.setState({
            participants: [],
            currentIndex: 0,
            isOpen: false,
        });
    });

    it('should have correct initial state', () => {
        const { result } = renderHook(() => useCoopStore());

        expect(result.current.participants).toEqual([]);
        expect(result.current.currentIndex).toBe(0);
        expect(result.current.isOpen).toBe(false);
    });

    describe('addParticipant', () => {
        it('should add a valid participant', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                const res = result.current.addParticipant('Alice');
                expect(res.success).toBe(true);
            });

            expect(result.current.participants).toEqual(['Alice']);
        });

        it('should trim participant name', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('  Bob  ');
            });

            expect(result.current.participants).toEqual(['Bob']);
        });

        it('should not add empty name', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                const res = result.current.addParticipant('   ');
                expect(res.success).toBe(false);
            });

            expect(result.current.participants).toEqual([]);
        });

        it('should respect the 30 participants limit', () => {
            const { result } = renderHook(() => useCoopStore());

            // Add 30 participants
            act(() => {
                for (let i = 0; i < 30; i++) {
                    result.current.addParticipant(`User ${i}`);
                }
            });

            expect(result.current.participants).toHaveLength(30);

            // Try to add 31st
            act(() => {
                const res = result.current.addParticipant('Too Many');
                expect(res.success).toBe(false);
                expect(res.error).toContain('30 personnes');
            });

            expect(result.current.participants).toHaveLength(30);
        });
    });

    describe('removeParticipant', () => {
        it('should remove a participant by index', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.addParticipant('Bob');
                result.current.removeParticipant(0);
            });

            expect(result.current.participants).toEqual(['Bob']);
        });

        it('should reset currentIndex if it goes out of bounds after removal', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.addParticipant('Bob');
                result.current.nextTurn(); // index becomes 1 (Bob's turn)
            });

            expect(result.current.currentIndex).toBe(1);

            act(() => {
                result.current.removeParticipant(1); // Remove Bob
            });

            expect(result.current.participants).toEqual(['Alice']);
            expect(result.current.currentIndex).toBe(0);
        });
        
        it('should handle last participant removal', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.removeParticipant(0);
            });

            expect(result.current.participants).toEqual([]);
            expect(result.current.currentIndex).toBe(0);
        });
    });

    describe('turn logic', () => {
        it('should cycle through participants with nextTurn', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.addParticipant('Bob');
                result.current.addParticipant('Charlie');
            });

            expect(result.current.currentIndex).toBe(0); // Alice

            act(() => { result.current.nextTurn(); });
            expect(result.current.currentIndex).toBe(1); // Bob

            act(() => { result.current.nextTurn(); });
            expect(result.current.currentIndex).toBe(2); // Charlie

            act(() => { result.current.nextTurn(); });
            expect(result.current.currentIndex).toBe(0); // Back to Alice
        });

        it('should handle nextTurn with no participants', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.nextTurn();
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should reset turn to 0 with resetTurn', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.addParticipant('Bob');
                result.current.nextTurn();
            });

            expect(result.current.currentIndex).toBe(1);

            act(() => {
                result.current.resetTurn();
            });

            expect(result.current.currentIndex).toBe(0);
        });

        it('should clear all participants and reset index with clearParticipants', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.addParticipant('Alice');
                result.current.addParticipant('Bob');
                result.current.nextTurn();
                result.current.clearParticipants();
            });

            expect(result.current.participants).toEqual([]);
            expect(result.current.currentIndex).toBe(0);
        });
    });

    describe('UI state', () => {
        it('should toggle drawer visibility', () => {
            const { result } = renderHook(() => useCoopStore());

            expect(result.current.isOpen).toBe(false);

            act(() => {
                result.current.toggleDrawer();
            });
            expect(result.current.isOpen).toBe(true);

            act(() => {
                result.current.toggleDrawer();
            });
            expect(result.current.isOpen).toBe(false);
        });

        it('should set drawer visibility via setOpen', () => {
            const { result } = renderHook(() => useCoopStore());

            act(() => {
                result.current.setOpen(true);
            });
            expect(result.current.isOpen).toBe(true);

            act(() => {
                result.current.setOpen(false);
            });
            expect(result.current.isOpen).toBe(false);
        });
    });
});

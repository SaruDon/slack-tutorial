import { atom, useAtom } from 'jotai';

const modalAtom = atom(false)

export const useCreateWorkSpaceModal = () => {
  return useAtom(modalAtom);
}
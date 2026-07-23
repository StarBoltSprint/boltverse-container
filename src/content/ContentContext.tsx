import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Experience } from "../data/mock";
import {
  type DraftExperience,
  addCodexUnlock,
  bumpHowlCount,
  draftToExperience,
  getFullDiscoverFeed,
  loadCodexUnlocks,
  loadDisplayName,
  loadDrafts,
  loadHowlCount,
  loadPublished,
  newDraftId,
  saveDisplayName,
  saveDrafts,
  savePublished,
} from "../data/contentStore";

interface ContentContextValue {
  published: Experience[];
  drafts: DraftExperience[];
  discoverFeed: Experience[];
  displayName: string;
  howlCount: number;
  codexUnlocks: string[];
  setDisplayName: (name: string) => void;
  saveDraft: (draft: Omit<DraftExperience, "id" | "updatedAt"> & { id?: string }) => DraftExperience;
  deleteDraft: (id: string) => void;
  publishDraft: (id: string) => Experience | null;
  publishNew: (input: {
    title: string;
    type: Experience["type"];
    description: string;
    emoji: string;
    durationMin: number;
  }) => Experience;
  unlockCodex: (id: string) => void;
  doHowl: () => number;
  findExperience: (id: string) => Experience | undefined;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [published, setPublished] = useState<Experience[]>(() => loadPublished());
  const [drafts, setDrafts] = useState<DraftExperience[]>(() => loadDrafts());
  const [displayName, setDisplayNameState] = useState(() => loadDisplayName());
  const [howlCount, setHowlCount] = useState(() => loadHowlCount());
  const [codexUnlocks, setCodexUnlocks] = useState<string[]>(() => loadCodexUnlocks());

  const discoverFeed = useMemo(() => getFullDiscoverFeed(published), [published]);

  const setDisplayName = useCallback((name: string) => {
    saveDisplayName(name);
    setDisplayNameState(loadDisplayName());
  }, []);

  const saveDraft = useCallback(
    (input: Omit<DraftExperience, "id" | "updatedAt"> & { id?: string }) => {
      const id = input.id ?? newDraftId();
      const draft: DraftExperience = {
        id,
        title: input.title,
        type: input.type,
        description: input.description,
        emoji: input.emoji,
        durationMin: input.durationMin,
        updatedAt: Date.now(),
      };
      setDrafts((prev) => {
        const next = [...prev.filter((d) => d.id !== id), draft].sort(
          (a, b) => b.updatedAt - a.updatedAt
        );
        saveDrafts(next);
        return next;
      });
      return draft;
    },
    []
  );

  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDrafts(next);
      return next;
    });
  }, []);

  const publishDraft = useCallback(
    (id: string) => {
      const draft = drafts.find((d) => d.id === id);
      if (!draft) return null;
      const exp = draftToExperience(draft, displayName);
      setPublished((prev) => {
        const next = [exp, ...prev.filter((p) => p.id !== exp.id)];
        savePublished(next);
        return next;
      });
      setDrafts((prev) => {
        const next = prev.filter((d) => d.id !== id);
        saveDrafts(next);
        return next;
      });
      return exp;
    },
    [drafts, displayName]
  );

  const publishNew = useCallback(
    (input: {
      title: string;
      type: Experience["type"];
      description: string;
      emoji: string;
      durationMin: number;
    }) => {
      const draft = saveDraft(input);
      const exp = draftToExperience(draft, displayName);
      setPublished((prev) => {
        const next = [exp, ...prev.filter((p) => p.id !== exp.id)];
        savePublished(next);
        return next;
      });
      setDrafts((prev) => {
        const next = prev.filter((d) => d.id !== draft.id);
        saveDrafts(next);
        return next;
      });
      return exp;
    },
    [displayName, saveDraft]
  );

  const unlockCodex = useCallback((id: string) => {
    addCodexUnlock(id);
    setCodexUnlocks(loadCodexUnlocks());
  }, []);

  const doHowl = useCallback(() => {
    const n = bumpHowlCount();
    setHowlCount(n);
    return n;
  }, []);

  const findExperience = useCallback(
    (id: string) => published.find((e) => e.id === id) ?? discoverFeed.find((e) => e.id === id),
    [published, discoverFeed]
  );

  const value = useMemo(
    () => ({
      published,
      drafts,
      discoverFeed,
      displayName,
      howlCount,
      codexUnlocks,
      setDisplayName,
      saveDraft,
      deleteDraft,
      publishDraft,
      publishNew,
      unlockCodex,
      doHowl,
      findExperience,
    }),
    [
      published,
      drafts,
      discoverFeed,
      displayName,
      howlCount,
      codexUnlocks,
      setDisplayName,
      saveDraft,
      deleteDraft,
      publishDraft,
      publishNew,
      unlockCodex,
      doHowl,
      findExperience,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

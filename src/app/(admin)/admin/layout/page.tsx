'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/frontend/components/ui/Button';
import { Save, GripVertical, Eye, EyeOff } from 'lucide-react';
import { LayoutSection } from '@/backend/layout-config';
import { saveLayoutConfig } from '@/backend/actions/layout-actions';
import { toast } from 'sonner';

// Initial state mock - in real app this comes from DB
const INITIAL_SECTIONS: LayoutSection[] = [
    { id: 'hero-1', type: 'hero', title: 'Banner Principal', visible: true, order: 0 },
    { id: 'products-1', type: 'products', title: 'Destaques', visible: true, order: 1 },
    { id: 'categories-1', type: 'categories', title: 'Categorias', visible: true, order: 2 },
    { id: 'newsletter-1', type: 'newsletter', title: 'Newsletter', visible: false, order: 3 },
];

export default function LayoutEditor() {
    const [sections, setSections] = useState(INITIAL_SECTIONS);
    const [isSaving, setIsSaving] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update order property
        const updatedItems = items.map((item, index) => ({ ...item, order: index }));
        setSections(updatedItems);
    };

    const toggleVisibility = (id: string) => {
        setSections(sections.map(s =>
            s.id === id ? { ...s, visible: !s.visible } : s
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveLayoutConfig(sections);
            toast.success("Layout salvo com sucesso!");
        } catch {
            toast.error("Erro ao salvar layout.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Editor da Home Page</h1>
                <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>

            <p className="text-muted-foreground">Arraste os itens para reordenar a página inicial. Clique no olho para ocultar/exibir.</p>

            <div className="glass border border-border rounded-xl p-6 shadow-sm">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="layout-sections">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {sections.map((section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} className="flex items-center bg-gray-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 group hover:border-primary/50 transition-colors">
                                                <div {...provided.dragHandleProps} className="mr-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                                    <GripVertical className="h-5 w-5" />
                                                </div>

                                                <div className="flex-1">
                                                    <span className="font-medium">{section.title}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground uppercase tracking-wider">{section.type}</span>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleVisibility(section.id)}
                                                    className={section.visible ? "text-green-600" : "text-gray-400"}
                                                >
                                                    {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </Button>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

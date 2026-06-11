import Fullcalendar from '@fullcalendar/react'
import DayGridPlugin from '@fullcalendar/daygrid'
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { api } from '@/lib/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { modal } from '@/components/modal';
import { FormSchedule } from '@/modals/form-schedule';


export const handle = { title: 'Agendamentos' }

export function Component() {


    const barbeirosQuery = api.barbers.list.useQuery()
    const schedulesQuery = api.schedules.list.useQuery()

    const events = schedulesQuery.data?.map(item => {
        return { 
            backgroundColor: `var(--primary)`, 
            padding: `0px`, 
            borderColor: 'transparent', 
            title: `${item.service.name} de ${item.clientName}`, 
            start: item.start, 
            end: item.end, 
            resourceId: item.barberid }
        
    }) ?? []

    const resources = barbeirosQuery.data?.map(b => ({ id: b.id, title: b.name })) ?? []

    async function handleOpenForm() {
        const response = await modal(FormSchedule, { title: `Novo agendamento`});

        if(response) {
            schedulesQuery.refetch()
        }
    }

    return <div className='p-4'>
        <Fullcalendar
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth newEvent",
            }} height={`auto`}
            locale={ptBrLocale}
            plugins={[DayGridPlugin, resourceTimelinePlugin]}
            initialView='resourceTimelineDay'
            resources={resources}
            events={events}
            customButtons={{
                newEvent: {
                    text: `Novo agendamento`,
                    click: handleOpenForm
                }
            }}
            eventContent={arg => (<Popover>
                <PopoverTrigger asChild>
                    <div className='w-full h-full bg-primary'>
                        &nbsp;
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <p>{arg.event.title}</p>

                    <hr />
                    <p>{arg.event.start?.toLocaleTimeString()} a {arg.event.end?.toLocaleTimeString()}</p>
                    <div className="flex">
                        <Button size={`icon-sm`} variant={`ghost`}><Trash2Icon /></Button>
                    </div>
                </PopoverContent>
            </Popover>)}
        />
    </div>
}
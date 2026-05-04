import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { Card, CardContent } from '../components/ui/card';
import { CompactActionDialog } from '../components/common/compact-action-dialog';

export default function Calendar() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('week');
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [events, setEvents] = useState<{ id: string; title: string; colIdx: number; rowIdx: number }[]>([]);

  // Handle Easy Booking
  const handleGridClick = (colIdx: number, rowIdx: number, timeStr: string) => {
     if (currentUser?.easyBooking) {
        setSelectedTime(JSON.stringify({ colIdx, rowIdx, timeStr }));
        setShowEventDialog(true);
     }
  };

  return (
    <div className="h-full flex flex-col p-8 pt-6 animate-in fade-in duration-500">
      
      {/* Seamless Header with Tab Navigation */}
      <div className="flex items-center justify-between border-b border-border mb-6 pb-2">
         <div className="flex items-center gap-6">
            <h2 className="text-2xl font-thin tracking-wide">Schedule</h2>
            
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-md">
               {['month', 'week', 'day', 'production'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-3 py-1.5 text-xs uppercase tracking-wider font-emphasis rounded transition-colors ${activeTab !== tab ? 'text-muted-foreground' : ''}`}
                   data-state={activeTab === tab ? 'active' : 'inactive'}
                 >
                    {tab}
                 </button>
               ))}
            </div>
         </div>

         {/* New Event Integrated Add Button */}
         <button onClick={() => { setSelectedTime('New Event'); setShowEventDialog(true); }} className="flex items-center gap-2 text-muted-foreground transition-colors group">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300" style={{ fontSize: '32px' }}>add_circle</span>
         </button>
      </div>

      {/* Grid Canvas area */}
      <Card className="bg-transparent border-none shadow-none flex-1 overflow-auto">
         <CardContent className="p-0 h-full relative border border-border/50 rounded-lg overflow-hidden bg-background/50">
            
            {/* Very basic mock of an hourly grid for Week/Day/Production views */}
            <div className="flex flex-col h-[1200px] min-w-[800px] relative">
               
               {/* Time labels axis */}
               <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-border/50 flex flex-col pt-12 bg-background z-10">
                  {Array.from({length: 12}).map((_, i) => (
                     <div key={i} className="flex-1 border-b border-border/30 text-[10px] text-muted-foreground text-center pt-2">
                        {i + 8}:00
                     </div>
                  ))}
               </div>

               {/* Columns axis */}
               <div className="absolute left-16 right-0 top-0 h-12 border-b border-border flex bg-background z-10">
                  {activeTab === 'production' ? (
                     // Production Schedule Columns represent Locations
                     <>
                        <div className="flex-1 border-r border-border/50 text-xs font-medium text-center py-3 uppercase tracking-wider">Studio A</div>
                        <div className="flex-1 border-r border-border/50 text-xs font-medium text-center py-3 uppercase tracking-wider">Sound Stage</div>
                        <div className="flex-1 text-xs font-medium text-center py-3 uppercase tracking-wider">Location Shoot</div>
                     </>
                  ) : (
                     // Standard Week Columns represent Days
                     Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-border/50 text-xs font-medium text-center py-3">
                           MON {14 + i}
                        </div>
                     ))
                  )}
               </div>

               {/* Grid cells */}
               <div className="absolute left-16 right-0 top-12 bottom-0 flex">
                  {Array.from({length: activeTab === 'production' ? 3 : 5}).map((_, colIdx) => (
                     <div key={colIdx} className="flex-1 border-r border-border/50 flex flex-col relative">
                        {Array.from({length: 12}).map((_, rowIdx) => (
                           <div 
                              key={rowIdx} 
                              className={`flex-1 border-b border-border/30 font-emphasis transition-colors ${currentUser?.easyBooking ? 'cursor-pointer' : ''}`}
                              onClick={() => handleGridClick(colIdx, rowIdx, `Column ${colIdx+1}, Time ${rowIdx + 8}:00`)}
                           >
                              {/* Lunch Break Application (12:00 - 14:30) -> which is rows index 4, 5, and top half of 6. We'll simply mock row 4 and 5 */}
                              {(rowIdx === 4 || rowIdx === 5) && (
                                 <div className="w-full h-full lunch-break-pattern opacity-30 pointer-events-none" />
                              )}
                           </div>
                        ))}

                        {/* User Created Events */}
                        {events.filter(e => e.colIdx === colIdx).map((ev) => (
                           <div key={ev.id} style={{ top: `${(ev.rowIdx / 12) * 100}%`, height: `${(1 / 12) * 100}%` }} className="absolute left-2 right-2 bg-primary/20 border border-primary text-primary rounded-md p-2 shadow-sm z-20 pointer-events-none">
                              <span className="text-xs font-medium block">{ev.title}</span>
                           </div>
                        ))}

                        {/* Mock Event Block */}
                        {colIdx === 1 && (
                           <div className="absolute top-[20%] h-[15%] left-2 right-2 bg-primary/20 border border-primary text-primary rounded-md p-2 shadow-sm z-20 pointer-events-none">
                              <span className="text-xs font-medium block">Strategic Review</span>
                              <span className="text-[10px] opacity-70">10:30 - 12:00</span>
                           </div>
                        )}
                        {colIdx === 2 && activeTab === 'production' && (
                           <div className="absolute top-[40%] h-[20%] left-2 right-2 bg-destructive/20 border border-destructive text-destructive rounded-md p-2 shadow-sm z-20 pointer-events-none">
                              <span className="text-xs font-medium block">Camera Setup</span>
                              <span className="text-[10px] opacity-70">13:00 - 15:00</span>
                           </div>
                        )}
                     </div>
                  ))}
               </div>

            </div>
         </CardContent>
      </Card>

      {/* New Event Dialog intercepting click-to-create */}
      <CompactActionDialog
         open={showEventDialog}
         onOpenChange={setShowEventDialog}
         icon="event"
         iconColor="text-primary"
         title="Create Event"
         description={selectedTime !== 'New Event' ? `Spawn an event block at ${JSON.parse(selectedTime || '{}').timeStr}?` : "Create a new calendar entry manually."}
         onAction={() => {
            if (selectedTime !== 'New Event') {
               const parsed = JSON.parse(selectedTime);
               setEvents(prev => [...prev, { id: crypto.randomUUID(), title: 'New Event', colIdx: parsed.colIdx, rowIdx: parsed.rowIdx }]);
            }
            setShowEventDialog(false);
         }}
      />
    </div>
  );
}
